using Finance_Helper.Service.GastoSevice;
using Microsoft.AspNetCore.Mvc;

namespace Finance_Helper.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GastoController : ControllerBase
    {
        private readonly IGastoInterface _gastoService;

        public GastoController(IGastoInterface gastoService)
        {
            _gastoService = gastoService;
        }

        [HttpGet("usuario/{usuarioId}")]
        public async Task<IActionResult> GetGastosByUsuario(int usuarioId)
        {
            var response = await _gastoService.GetGastosByUsuarioAsync(usuarioId);
            return Ok(response);
        }

        [HttpPost("usuario/{usuarioId}")]
        public async Task<IActionResult> AddGasto(int usuarioId, [FromBody] GastoDTO novoGasto)
        {
            var response = await _gastoService.AddGastoAsync(usuarioId, novoGasto);
            return Ok(response);
        }

        [HttpDelete("{gastoId}")]
        public async Task<IActionResult> DeleteGasto(int gastoId)
        {
            var response = await _gastoService.DeleteGastoAsync(gastoId);
            return Ok(response);
        }

        [HttpGet("resumo/{usuarioId}")]
        public async Task<IActionResult> GetResumoMensal(
        int usuarioId,
        [FromQuery] int mes,
        [FromQuery] int ano
        )
        {
            var response = await _gastoService.GetResumoMensalAsync(usuarioId, mes, ano);
            return Ok(response);
        }
    }
}
