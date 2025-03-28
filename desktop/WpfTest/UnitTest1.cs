using Moq;
using Moq.Protected;
using Newtonsoft.Json;
using StudentHiveWpf.Models;
using StudentHiveWpf.Services;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace StudentHiveWpf.Tests
{
    public class ApiServiceTests
    {
        private readonly string _baseApiUrl = "https://localhost:7067/api/general/";
        private readonly Mock<HttpMessageHandler> _httpMessageHandlerMock;
        private readonly HttpClient _httpClient;
        private readonly Mock<IHttpClientFactory> _httpClientFactoryMock;
        private readonly ApiService _apiService;

        public ApiServiceTests()
        {
            _httpMessageHandlerMock = new Mock<HttpMessageHandler>();

            _httpClient = new HttpClient(_httpMessageHandlerMock.Object)
            {
                BaseAddress = new Uri(_baseApiUrl)
            };

            _httpClientFactoryMock = new Mock<IHttpClientFactory>();
            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(_httpClient);

            _apiService = new ApiService(_httpClientFactoryMock.Object);
        }

        [Fact]
        public async Task GetAllUsersAsync_ShouldReturnUsers()
        {
            var users = new List<User>
            {
                new User { Id = 1, FirstName = "John", LastName = "Doe", Email = "john.doe@example.com" },
                new User { Id = 2, FirstName = "Jane", LastName = "Smith", Email = "jane.smith@example.com" }
            };

            var jsonResponse = JsonConvert.SerializeObject(users);
            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(jsonResponse, Encoding.UTF8, "application/json")
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req => req.Method == HttpMethod.Get && req.RequestUri.ToString() == $"{_baseApiUrl}alluser"),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(responseMessage);

            var result = await _apiService.GetAllUsersAsync();

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("John", result[0].FirstName);
            Assert.Equal("Jane", result[1].FirstName);
        }

        [Fact]
        public async Task GetAllUsersAsync_ShouldReturnNonEmptyList_WhenUsersExist()
        {
            var createUserRequest = new
            {
                FirstName = "Test",
                LastName = "User",
                Email = "test.user@example.com",
                Password = "TestPassword123!"
            };

            var createdUserResponse = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.Created
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req => req.Method == HttpMethod.Post && req.RequestUri.ToString() == $"{_baseApiUrl}register"),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(createdUserResponse);

            var users = new List<User>
            {
                new User { Id = 1, FirstName = "Test", LastName = "User", Email = "test.user@example.com" }
            };

            var jsonResponse = JsonConvert.SerializeObject(users);
            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent(jsonResponse, Encoding.UTF8, "application/json")
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req => req.Method == HttpMethod.Get && req.RequestUri.ToString() == $"{_baseApiUrl}alluser"),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(responseMessage);

            var createUserContent = new StringContent(JsonConvert.SerializeObject(createUserRequest), Encoding.UTF8, "application/json");
            var createUserResponse = await _httpClient.PostAsync($"{_baseApiUrl}register", createUserContent);

            createUserResponse.EnsureSuccessStatusCode();

            var response = await _httpClient.GetAsync($"{_baseApiUrl}alluser");

            response.EnsureSuccessStatusCode();

            var jsonResponseString = await response.Content.ReadAsStringAsync();
            var resultUsers = JsonConvert.DeserializeObject<List<User>>(jsonResponseString);

            Assert.NotNull(resultUsers);
            Assert.True(resultUsers.Count > 0, "Az API-nak legalább egy felhasználót kellene visszaadnia.");
        }

        [Fact]
        public async Task ToggleUserStatusAsync_ShouldReturnSuccess_WhenUserExists()
        {
            int userId = 1;
            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req =>
                        req.Method == HttpMethod.Patch &&
                        req.RequestUri.ToString() == $"{_baseApiUrl}update-user-status/{userId}"),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(responseMessage);

            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-status/{userId}", null);

            response.EnsureSuccessStatusCode();
        }

        [Fact]
        public async Task ToggleUserStatusAsync_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            int userId = 9999;
            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.NotFound
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req =>
                        req.Method == HttpMethod.Patch &&
                        req.RequestUri.ToString() == $"{_baseApiUrl}update-user-status/{userId}"),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(responseMessage);

            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-status/{userId}", null);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task UpdateUserPasswordAsync_ShouldReturnSuccess_WhenPasswordUpdated()
        {
            int userId = 1;
            var newPassword = "newSecurePassword123";
            var requestBody = new { NewPassword = newPassword };
            var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req =>
                        req.Method == HttpMethod.Patch &&
                        req.RequestUri.ToString() == $"{_baseApiUrl}update-user-password/{userId}" &&
                        req.Content.ReadAsStringAsync().Result.Contains(newPassword)),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(responseMessage);

            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-password/{userId}", content);

            response.EnsureSuccessStatusCode();
        }


        [Fact]
        public async Task UpdateUserPasswordAsync_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            int nonExistentUserId = 99999; 
            var newPassword = "NewSecurePassword123!";
            var requestBody = new { NewPassword = newPassword };
            var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.NotFound
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req =>
                        req.Method == HttpMethod.Patch &&
                        req.RequestUri.ToString() == $"{_baseApiUrl}update-user-password/{nonExistentUserId}" &&
                        req.Content.ReadAsStringAsync().Result.Contains(newPassword)),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(responseMessage);

            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-password/{nonExistentUserId}", content);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }


        [Fact]
        public async Task ToggleUserStatusAsync_ShouldReturnResponseWithinExpectedTime()
        {
            int existingUserId = 1; 
            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req =>
                        req.Method == HttpMethod.Patch &&
                        req.RequestUri.ToString() == $"{_baseApiUrl}update-user-status/{existingUserId}"),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(responseMessage);

            var startTime = DateTime.Now;
            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-status/{existingUserId}", null);
            var endTime = DateTime.Now;

            var responseTime = (endTime - startTime).TotalSeconds;

            Assert.True(responseTime < 1, $"A válaszidő túl hosszú: {responseTime} másodperc.");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }


        [Fact]
        public async Task UpdateUserProfileAsync_ShouldReturnSuccess_WhenProfileUpdated()
        {
            int userId = 1;
            string firstName = "John";
            string lastName = "Doe";
            string email = "john.doe@example.com";
            var requestBody = new { FirstName = firstName, LastName = lastName, Email = email };
            var content = new StringContent(JsonConvert.SerializeObject(requestBody), System.Text.Encoding.UTF8, "application/json");

            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req =>
                        req.Method == HttpMethod.Patch &&
                        req.RequestUri.ToString() == $"{_baseApiUrl}update-user-profile/{userId}"),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(responseMessage);

            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-profile/{userId}", content);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }


        [Theory]
        [InlineData(1, "John", "Doe", "john.doe@example.com")]
        [InlineData(2, "Jane", "Smith", "jane.smith@example.com")]
        public async Task UpdateUserProfileAsync_ShouldReturnSuccess_ForDifferentUsers(int userId, string firstName, string lastName, string email)
        {
            var requestBody = new { FirstName = firstName, LastName = lastName, Email = email };
            var content = new StringContent(JsonConvert.SerializeObject(requestBody), System.Text.Encoding.UTF8, "application/json");

            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req =>
                        req.Method == HttpMethod.Patch &&
                        req.RequestUri.ToString() == $"{_baseApiUrl}update-user-profile/{userId}"),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(responseMessage);

            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-profile/{userId}", content);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }


        [Fact]
        public async Task UpdateUserProfileAsync_ShouldReturnNotFound_WhenUserDoesNotExist()
        {
            int nonExistentUserId = 99999; 
            string firstName = "Ghost";
            string lastName = "User";
            string email = "ghost.user@example.com";

            var requestBody = new { FirstName = firstName, LastName = lastName, Email = email };
            var content = new StringContent(JsonConvert.SerializeObject(requestBody), System.Text.Encoding.UTF8, "application/json");

            var responseMessage = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.NotFound
            };

            _httpMessageHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.Is<HttpRequestMessage>(req =>
                        req.Method == HttpMethod.Patch &&
                        req.RequestUri.ToString() == $"{_baseApiUrl}update-user-profile/{nonExistentUserId}"),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(responseMessage);

            var response = await _httpClient.PatchAsync($"{_baseApiUrl}update-user-profile/{nonExistentUserId}", content);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

    }
}