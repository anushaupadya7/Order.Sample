<%@ Page Language="C#" MasterPageFile="~/Share/MasterPages/Master.master" AutoEventWireup="true" Inherits="Order.Sample.Default" Codebehind="Default.aspx.cs" %>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        .hero {
            background: linear-gradient(135deg, #2d4373 0%, #3b5998 100%);
            color: white;
            padding: 60px 20px;
            text-align: center;
            margin: -20px -20px 20px -20px;
        }
        .hero h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        .hero p {
            font-size: 1.25rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto 2rem;
        }
        .cta-button {
            display: inline-block;
            background: white;
            color: #3b5998;
            padding: 12px 32px;
            border-radius: 6px;
            font-weight: bold;
            text-decoration: none;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            text-decoration: none;
        }
        .features {
            padding: 40px 20px;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            max-width: 1000px;
            margin: 0 auto;
        }
        .feature-card {
            background: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .feature-card h3 {
            color: #3b5998;
            margin-bottom: 12px;
        }
        .feature-card p {
            color: #666;
            font-size: 14px;
        }
        .section-title {
            text-align: center;
            margin-bottom: 40px;
        }
        .section-title h2 {
            color: #333;
            font-size: 2rem;
        }
    </style>
</asp:Content>

<asp:Content ID="Content1" ContentPlaceHolderID="PageBody" runat="Server">
    <div class="hero">
        <h1>� E-Commerce Orders Sample</h1>
        <p>A sample application demonstrating e-commerce product orders functionality with randomized mock data.</p>
        <a href="Order/List/OrderList.aspx" class="cta-button">View Product Orders Demo →</a>
    </div>

    <div class="features">
        <div class="section-title">
            <h2>Features</h2>
            <p>This sample application includes the following features:</p>
        </div>
        <div class="features-grid">
            <div class="feature-card">
                <h3>📊 Product Orders List</h3>
                <p>Interactive list displaying e-commerce product orders with sorting and filtering capabilities. Data is randomized on each page load and search.</p>
            </div>
            <div class="feature-card">
                <h3>🔍 Search Filters</h3>
                <p>Filter by category, order status, customer, order total range, and minimum quantity. Filters update the list in real-time.</p>
            </div>
            <div class="feature-card">
                <h3>📈 Randomized Data</h3>
                <p>All data points are randomly generated to demonstrate the UI without requiring a database connection.</p>
            </div>
            <div class="feature-card">
                <h3>🛒 Pending Orders</h3>
                <p>View and manage pending orders with priority rankings and order totals.</p>
            </div>
            <div class="feature-card">
                <h3>📱 Standalone Sample</h3>
                <p>Self-contained sample project demonstrating order management patterns without external dependencies.</p>
            </div>
            <div class="feature-card">
                <h3>🔌 ASHX Handler</h3>
                <p>OrderData.ashx handler provides mock data for AJAX requests, simulating the real application behavior.</p>
            </div>
        </div>
    </div>
</asp:Content>
