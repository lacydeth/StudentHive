using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using StudentHiveServer.Controllers;
using Xunit;
using static StudentHiveServer.Controllers.UserController;
public class StudentDetailsControllerTests
{
    [Fact]
    public void GenerateRandomPassword_ShouldReturnCorrectLength()
    {
        // Arrange
        int expectedLength = 10;

        // Act
        string password = OrganizationController.GenerateRandomPassword(expectedLength);

        // Assert
        Assert.Equal(expectedLength, password.Length);
    }

    [Fact]
    public void GenerateRandomPassword_ShouldContainOnlyAllowedCharacters()
    {
        // Arrange
        const string allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        int passwordLength = 10;

        // Act
        string password = OrganizationController.GenerateRandomPassword(passwordLength);

        // Assert
        Assert.True(password.All(c => allowedChars.Contains(c)));
    }
}

