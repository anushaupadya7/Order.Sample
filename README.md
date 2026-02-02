# E-Commerce Orders Sample

A sample ASP.NET WebForms application demonstrating e-commerce product order management with randomized mock data.

## Overview

This sample application demonstrates order management patterns with a focus on product order listings. All data points are randomized using the `MockDataGenerator` class.

## Project Structure

```
Va.Web.Sample/
├── Default.aspx                    # Home page
├── Global.asax                     # Application lifecycle
├── Web.config                      # Configuration
├── packages.config                 # NuGet packages
├── Va.Web.Sample.csproj           # Project file
│
├── Order/
│   └── List/
│       ├── OrderList.aspx         # Main Product Orders page
│       ├── OrderData.ashx         # AJAX data handler
│       ├── scripts/
│       │   ├── OrderListBase.js   # Base functionality
│       │   ├── OrderList.js       # Page-specific logic
│       │   └── OrderList-grid.js  # Grid functionality
│       └── styles/
│           └── Order.css          # Order list styles
│
├── Models/
│   ├── OrderListModels.cs         # DTOs and data models
│   └── MockDataGenerator.cs       # Random data generator
│
├── Share/
│   └── MasterPages/
│       └── Master.master          # Master page template
│
├── Styles/
│   ├── Site.css                   # Base site styles
│   └── Scale.css                  # Scale utilities
│
├── images/
│   └── icons/
│       └── README.md              # Icon placeholder info
│
└── Properties/
    └── AssemblyInfo.cs            # Assembly metadata
```

## Technology Stack

- **.NET Framework 4.7.2**
- **ASP.NET WebForms**
- **ExtJS 3.4.1** (via cdnjs.cloudflare.com)
- **Newtonsoft.Json** for JSON serialization

## Features

- Product orders list with randomized e-commerce data
- Filter controls (category, order status, customer, order total range, quantity)
- Pending orders panel
- Order details dialog
- AJAX data loading via HTTP handler

## Mock Data

The `MockDataGenerator` class generates realistic randomized data including:

- **Products**: Wireless Headphones, USB-C Hub, Keyboard, Monitor, etc.
- **Categories**: Electronics, Accessories, Computers, Mobile, Audio, Wearables
- **Order Statuses**: Pending, Processing, Shipped, Delivered, Cancelled, Refunded
- **Customers**: John Smith, Jane Johnson, etc.
- **Order Total Range**: $10 - $1,000
- **Shipping Methods**: Standard, Express, Next Day, Two-Day, Economy
- **Priority Score**: 1-100

## Running the Application

1. Open the solution in Visual Studio 2019 or later
2. Restore NuGet packages
3. Build the project
4. Press F5 to run with IIS Express

The application will open at `https://localhost:44300/`

## Key Files

### OrderList.aspx
The main product orders page with search filters and order list.

### OrderData.ashx
HTTP handler that returns JSON data for AJAX requests. Supports:
- Default action - Returns product order list data
- `Action=OrderDetails` - Returns order line item details

### MockDataGenerator.cs
Static class that generates all randomized data:
- `GenerateOrderData()` - Order list data with filters
- `GeneratePendingOrdersData()` - Pending orders panel
- `GenerateQueueStatus()` - Queue status info
- `GenerateOrderDetails()` - Order line item details

## Application Features

1. **No database dependency** - All data is generated randomly
2. **Simplified authentication** - No login required
3. **Self-contained** - No external service dependencies
4. **Uses public CDN** - ExtJS loaded from cdnjs.cloudflare.com

## License

This is a sample application for demonstration purposes only.
