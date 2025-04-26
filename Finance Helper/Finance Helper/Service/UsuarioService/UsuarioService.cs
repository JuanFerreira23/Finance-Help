using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Finance_Helper.DataContext;
using Finance_Helper.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.IdentityModel.Tokens;

namespace Finance_Helper.Service.UsuarioService
{
    public class UsuarioService : IUsuarioInterface
    {
        private readonly ApplicationDBContext _context; 
        private readonly IConfiguration _configuration;

        public UsuarioService(ApplicationDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<ServiceResponse<List<UsuarioModel>>> Createusuario(UsuarioModel newUsuario)
        {
            ServiceResponse<List<UsuarioModel>> serviceResponse = new ServiceResponse<List<UsuarioModel>>();

            try
            {
                if (newUsuario == null)
                {
                    serviceResponse.Dados = null;
                    serviceResponse.Mensagem = "Informar Dados";
                    serviceResponse.Sucesso = false;

                    return serviceResponse;
                }

                _context.Add(newUsuario);
                await _context.SaveChangesAsync();

                serviceResponse.Dados = _context.Usuarios.ToList();


            }
            catch (Exception ex)
            {

                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }

            return serviceResponse;
        }

        public Task<ServiceResponse<List<UsuarioModel>>> DeleteUsuario(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResponse<List<UsuarioModel>>> GetUsuarios()
        {
            ServiceResponse<List<UsuarioModel>> serviceResponse = new ServiceResponse<List<UsuarioModel>>();

            try
            {
                serviceResponse.Dados = _context.Usuarios.ToList();
            }
            catch (Exception ex) 
            { 
                serviceResponse.Mensagem = ex.Message;
                serviceResponse.Sucesso = false;
            }


            return serviceResponse;
        }

        public Task<ServiceResponse<UsuarioModel>> GetUsuariosById(int id)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResponse<List<UsuarioModel>>> UpdateUsusario(UsuarioModel editadoUsuario)
        {
            throw new NotImplementedException();
        }

        private string GenerateToken(UsuarioModel usuario)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
        new Claim(ClaimTypes.Email, usuario.Email)
    };

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        private bool VerificarSenha(string senhaDigitada, string senhaArmazenada)
        {
            Console.WriteLine($"Senha digitada: ", senhaDigitada);
            Console.WriteLine($"Senha armazenada: ", senhaArmazenada);
            return senhaDigitada == senhaArmazenada;

        }

        public async Task<ServiceResponse<object>> Login(string email, string senha)
        {
            var response = new ServiceResponse<object>();
            
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
            Console.WriteLine("Verificação de senha: " + VerificarSenha(senha, usuario.Senha));
            if (usuario == null || !VerificarSenha(senha, usuario.Senha))
            {
                response.Sucesso = false;
                response.Mensagem = "Usuário ou senha inválidos.";
                return response;
            }

            var accessToken = GenerateToken(usuario);
            var refreshToken = GenerateRefreshToken();

            // Invalida tokens anteriores
            var oldTokens = await _context.RefreshTokens
                .Where(t => t.UsuarioId == usuario.Id && !t.Revogado)
                .ToListAsync();

            foreach (var token in oldTokens)
            {
                token.Revogado = true;
            }

            var refreshTokenModel = new RefreshTokenModel
            {
                UsuarioId = usuario.Id,
                Token = refreshToken,
                Expiracao = DateTime.UtcNow.AddDays(7),
                Revogado = false
            };

            _context.RefreshTokens.Add(refreshTokenModel);
            await _context.SaveChangesAsync();
            
            response.Dados = new
            {
                accessToken,
                refreshToken,
                idUsuario = usuario.Id
            };
            return response;
        }

        // Método para gerar um Refresh Token aleatório
        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }

        public async Task<ServiceResponse<string>> RefreshToken(string refreshToken)
        {
            var response = new ServiceResponse<string>();

            var tokenModel = await _context.RefreshTokens
                .Include(r => r.Usuario)
                .FirstOrDefaultAsync(r => r.Token == refreshToken && !r.Revogado);

            if (tokenModel == null || tokenModel.Expiracao < DateTime.UtcNow)
            {
                response.Sucesso = false;
                response.Mensagem = "Refresh Token inválido ou expirado.";
                return response;
            }

            // Revogar o token antigo
            tokenModel.Revogado = true;

            // Gerar novo Access Token e Refresh Token
            var newAccessToken = GenerateToken(tokenModel.Usuario);
            var newRefreshToken = GenerateRefreshToken();

            var newRefreshTokenModel = new RefreshTokenModel
            {
                UsuarioId = tokenModel.UsuarioId,
                Token = newRefreshToken,
                Expiracao = DateTime.UtcNow.AddDays(7),
                Revogado = false
            };

            _context.RefreshTokens.Add(newRefreshTokenModel);
            await _context.SaveChangesAsync();

            response.Dados = newAccessToken;
            return response;
        }

    }
}
