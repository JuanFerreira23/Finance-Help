using Finance_Helper.DataContext;
using Microsoft.EntityFrameworkCore;
using Finance_Helper.Models;

namespace Finance_Helper.Service.GastoSevice
{
    public class GastoService : IGastoInterface
    {
        private readonly ApplicationDBContext _context;

        public GastoService(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse<GastoModel>> AddGastoAsync(int usuarioId, GastoDTO novoGasto)
        {
            var gasto = new GastoModel
            {
                UsuarioId = usuarioId,
                Titulo = novoGasto.Titulo,
                Valor = novoGasto.Valor,
                Categoria = novoGasto.Categoria,
                Data = novoGasto.Data
            };

            _context.Gastos.Add(gasto);
            await _context.SaveChangesAsync();

            return new ServiceResponse<GastoModel> { Dados = gasto, Sucesso = true };
        }

        public async Task<ServiceResponse<bool>> DeleteGastoAsync(int gastoId)
        {
            var gasto = await _context.Gastos.FindAsync(gastoId);
            if (gasto == null)
                return new ServiceResponse<bool> { Dados = false, Sucesso = false, Mensagem = "Gasto não encontrado" };

            _context.Gastos.Remove(gasto);
            await _context.SaveChangesAsync();

            return new ServiceResponse<bool> { Dados = true, Sucesso = true };
        }

        public async Task<ServiceResponse<List<GastoModel>>> GetGastosByUsuarioAsync(int usuarioId)
        {
            var gastos = await _context.Gastos.Where(g => g.UsuarioId == usuarioId).ToListAsync();
            return new ServiceResponse<List<GastoModel>> { Dados = gastos, Sucesso = true };
        }

        public async Task<ServiceResponse<decimal>> GetResumoMensalAsync(int usuarioId, int mes, int ano)
        {
            var total = await _context.Gastos
                .Where(g => g.UsuarioId == usuarioId && g.Data.Month == mes && g.Data.Year == ano)
                .SumAsync(g => g.Valor);

            return new ServiceResponse<decimal> { Dados = total, Sucesso = true };
        }
    }
}
