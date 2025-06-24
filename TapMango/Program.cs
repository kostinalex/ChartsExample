using System.Globalization;
using Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.MapGet("/getdata/{start}/{end}", (DateTime start, DateTime end) =>
{
    var totalSales = GenerateDateList(start, end);
    Random random = new Random();

    var allCustomers = random.Next(5000, 40000);
    var loyalCustomers = allCustomers * random.Next(30, 90) / 100;
    var allCustomersPerc = (decimal)(random.NextDouble() * 30);
    var loyalCustomersPerc = (decimal)(random.NextDouble() * 30);

    var online = random.Next(20000, 40000);
    var instore = online * random.Next(30, 90) / 100;
    var instorePerc = (decimal)(random.NextDouble() * 30);
    var onlinePerc = (decimal)(random.NextDouble() * 30);

    return new
    {
        totalSales,

        allCustomers,
        loyalCustomers,
        allCustomersPerc,
        loyalCustomersPerc,

        instore,
        online,
        instorePerc,
        onlinePerc

    };
});



app.MapGet("/", () =>
{
    return new { status = "ok" };
});

app.Run();

List<Data> GenerateDateList(DateTime startDate, DateTime endDate)
{
    List<Data> dateList = new();
    var random = new Random();

    for (DateTime date = startDate; date <= endDate; date = date.AddDays(1))
    {
        var allCustomers = random.Next(5000, 40000);
        dateList.Add(new Data
        {
            Date = date.ToString("MMM dd", CultureInfo.InvariantCulture),
            AllCustomers = allCustomers,
            Loyal = allCustomers * random.Next(30, 90) / 100,
        });
    }

    return dateList;
}

