using Finance_Helper.Models;
using Microsoft.EntityFrameworkCore;

namespace Finance_Helper.DataContext
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)  
        { 
        }


        public DbSet<UsuarioModel> Usuarios { get; set; }
        public DbSet<RefreshTokenModel> RefreshTokens { get; set; }
        public DbSet<GastoModel> Gastos { get; set; }

    }
}
