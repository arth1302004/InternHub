using System.Security.Cryptography;

namespace InternAttendenceSystem.Services.ServiceContracts
{
    public interface IEncryptionService
    {
        string GetPublicKey();
        string Encrypt(string plainText, string publicKey);
        string Decrypt(string cipherText);
        void GenerateKeys();
    }
}