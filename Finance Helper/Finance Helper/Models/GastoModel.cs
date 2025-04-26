using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace Finance_Helper.Models
{
    public class GastoModel
    {
        public int Id { get; set; }
        public string Titulo { get; set; }

        public decimal Valor { get; set; }

        public string Categoria { get; set; }

        public DateTime Data { get; set; }

        public int UsuarioId { get; set; }
        public UsuarioModel Usuario { get; set; }
    }
}
