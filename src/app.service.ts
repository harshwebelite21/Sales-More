import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SalesMore</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                text-align: center;
            }
    
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
            }
    
            h1 {
                color: #333;
            }
    
            .logo {
                max-width: 200px;
                margin: 20px auto;
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <img src="https://cdn5.vectorstock.com/i/1000x1000/58/54/more-sales-rubber-stamp-vector-16235854.jpg" alt="SalesMore Logo" class="logo">
            <h1>Welcome to SalesMore</h1>
            <p>Your one-stop destination for all your sales needs!</p>
        </div>
    </body>
    
    </html>
    `;
    return htmlContent;
  }
}
