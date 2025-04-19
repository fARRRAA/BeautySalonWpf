using BeautySalonApi.DataBase;
using BeautySalonApi.Models;
using BeautySalonApi.Requests;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Net.Mail;
using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
namespace BeautySalonApi.Services.ClientsService
{
    public class ClientService : IClientsService
    {
        readonly ContextDb _context;

        public ClientService(ContextDb context)
        {
            _context = context;
        }
        public List<Clients> All()
        {
            return _context.Clients.ToList();
        }
        public async Task SendVerificationCode(string email, int code)
        {
            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse("your-email@example.com"));
            message.To.Add(MailboxAddress.Parse(email));
            message.Subject = "Код подтверждения";
            message.Body = new TextPart("plain") { Text = $"Ваш код подтверждения: {code}" };

            using var smtp = new MailKit.Net.Smtp.SmtpClient();
            await smtp.ConnectAsync("smtp.example.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync("your-email@example.com", "your-password");
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }
        private int GenerateVerificationCode()
        {
            Random random = new Random();
            return random.Next(100000, 999999);
        }
        public async Task CreateClient(CreateClient client)
        {
            var verificationCode = GenerateVerificationCode();
            var expirationTime = DateTime.UtcNow.AddMinutes(3);

            var newClient = new Clients()
            {
                FName=client.FName,
                Lname=client.Lname,
                phone=client.phone,
                email=client.email,
                dateBirth=DateTime.Now,
                login="",
                password="",
                photo="",
                Preferences="",
                roleId=3,
                visitsCount=0,
                isEmailConfirmed=false,
                loginCode=verificationCode,
                codeExpiration=expirationTime
            };
            await _context.Clients.AddAsync(newClient);
            await _context.SaveChangesAsync();
            //await SendVerificationCode(newClient.email, verificationCode);

        }
        public async Task ConfirmEmail(Clients _client)
        {
            var client= await _context.Clients.FirstOrDefaultAsync(x=>x.email==_client.email);
            client.isEmailConfirmed = true;

            await _context.SaveChangesAsync();

        }
        public Clients GetClientByEmail(string email)
        {
            return _context.Clients.FirstOrDefault(x=>x.email== email); 
        }

        public Clients GetClientById(int id)
        {
            return _context.Clients.FirstOrDefault(x => x.userID ==id);
        }

        public Clients GetClientByPhone(string phone)
        {
            return _context.Clients.FirstOrDefault(x => x.phone == phone);
        }

        public bool isExists(string email)
        {
            return _context.Clients.Any(x=>x.email==email);
        }
    }
}
