
using InternAttendenceSystem.Services.ServiceContracts;
using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace InternAttendenceSystem.Services
{
    public class EncryptionService : IEncryptionService
    {
        private static RSACryptoServiceProvider _rsa;
        private static string _publicKey;
        private readonly string _privateKeyPath;

        public EncryptionService(IWebHostEnvironment env)
        {
            _privateKeyPath = Path.Combine(env.ContentRootPath, "private_key.xml");

            if (File.Exists(_privateKeyPath))
            {
                LoadKeys();
            }
            else
            {
                _rsa = new RSACryptoServiceProvider(2048);
                GenerateKeys();
            }
        }

        private void LoadKeys()
        {
            _rsa = new RSACryptoServiceProvider();
            var privateKeyXml = File.ReadAllText(_privateKeyPath);
            _rsa.FromXmlString(privateKeyXml);

            // Re-create the public key from the loaded private key
            var publicKeyBytes = _rsa.ExportSubjectPublicKeyInfo();
            var builder = new StringBuilder();
            builder.AppendLine("-----BEGIN PUBLIC KEY-----");
            builder.AppendLine(Convert.ToBase64String(publicKeyBytes, Base64FormattingOptions.InsertLineBreaks));
            builder.AppendLine("-----END PUBLIC KEY-----");
            _publicKey = builder.ToString();
        }

        public void GenerateKeys()
        {
            var privateKey = _rsa.ToXmlString(true);
            File.WriteAllText(_privateKeyPath, privateKey);

            var publicKeyBytes = _rsa.ExportSubjectPublicKeyInfo();
            var builder = new StringBuilder();
            builder.AppendLine("-----BEGIN PUBLIC KEY-----");
            builder.AppendLine(Convert.ToBase64String(publicKeyBytes, Base64FormattingOptions.InsertLineBreaks));
            builder.AppendLine("-----END PUBLIC KEY-----");
            _publicKey = builder.ToString();
        }

        public string GetPublicKey()
        {
            return _publicKey;
        }

        public string Encrypt(string plainText, string publicKey)
        {
            using (var rsa = new RSACryptoServiceProvider())
            {
                rsa.FromXmlString(publicKey);
                var data = Encoding.UTF8.GetBytes(plainText);
                var encryptedData = rsa.Encrypt(data, RSAEncryptionPadding.Pkcs1);
                return Convert.ToBase64String(encryptedData);
            }
        }

        public string Decrypt(string cipherText)
        {
            var data = Convert.FromBase64String(cipherText);
            var decryptedData = _rsa.Decrypt(data, RSAEncryptionPadding.Pkcs1);
            return Encoding.UTF8.GetString(decryptedData);
        }
    }
}
