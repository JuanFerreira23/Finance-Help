using Finance_Helper.Models;

namespace Finance_Helper.Service.GastoSevice
{
    public interface IGastoInterface
    {
        Task<ServiceResponse<List<GastoModel>>> GetGastosByUsuarioAsync(int usuarioId);
        Task<ServiceResponse<GastoModel>> AddGastoAsync(int usuarioId, GastoDTO novoGasto);
        Task<ServiceResponse<bool>> DeleteGastoAsync(int gastoId);
        Task<ServiceResponse<decimal>> GetResumoMensalAsync(int usuarioId, int mes, int ano);
    }
}
