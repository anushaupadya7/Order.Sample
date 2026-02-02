using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using Order.Sample.Models;

namespace Order.Sample.Order.List
{
    public partial class OrderList : Page
    {
        public bool HasPendingOrders { get; set; } = true;
        public bool HasAdvancedFeatures { get; set; } = true;

        protected void Page_Load(object sender, EventArgs e)
        {
            Title = "Product Orders";
            PageDescription.Text = "Use the search panel below to filter product orders. This is a sample application with randomized mock data.";

            if (!IsPostBack)
            {
                BindDropDowns();
                LoadInitialData();
            }
        }

        private void BindDropDowns()
        {
            // Product Categories
            CategoryDropDown.Items.Clear();
            CategoryDropDown.Items.Add(new ListItem("Show All", ""));
            foreach (var cat in MockDataGenerator.GetProductCategories())
            {
                CategoryDropDown.Items.Add(new ListItem(cat.Name, cat.Id.ToString()));
            }

            // Order Statuses
            OrderStatusDropDown.Items.Clear();
            OrderStatusDropDown.Items.Add(new ListItem("Show All", ""));
            foreach (var status in MockDataGenerator.GetOrderStatuses())
            {
                OrderStatusDropDown.Items.Add(new ListItem(status.Name, status.Id.ToString()));
            }

            // Customers
            CustomerDropDown.Items.Clear();
            CustomerDropDown.Items.Add(new ListItem("Show All", ""));
            foreach (var customer in MockDataGenerator.GetCustomerNames())
            {
                CustomerDropDown.Items.Add(new ListItem(customer, customer));
            }

            // Date range periods
            DateRangeDropDown.Items.Clear();
            DateRangeDropDown.Items.Add(new ListItem("Last 30 Days", "30"));
            DateRangeDropDown.Items.Add(new ListItem("Last 60 Days", "60"));
            DateRangeDropDown.Items.Add(new ListItem("Last 90 Days", "90"));
            DateRangeDropDown.Items.Add(new ListItem("Last 120 Days", "120"));
            DateRangeDropDown.SelectedValue = "90";
        }

        private void LoadInitialData()
        {
            // Generate criteria JSON
            var criteria = new OrderSearchCriteria
            {
                CategoryId = null,
                StatusId = null,
                CustomerName = null,
                MinimumOrderTotal = null,
                MaximumOrderTotal = null,
                MinimumQuantity = null,
                DateRangeDays = 90
            };
            CriteriaLiteral.Text = JsonConvert.SerializeObject(criteria);

            // Generate initial order data
            var orderData = MockDataGenerator.GenerateOrderData();
            InitialDataLiteral.Text = JsonConvert.SerializeObject(orderData);

            // Generate pending orders data
            var pendingOrdersData = MockDataGenerator.GeneratePendingOrdersData();
            PendingOrdersDataLiteral.Text = JsonConvert.SerializeObject(pendingOrdersData);

            // Generate queue data
            var queueData = MockDataGenerator.GenerateQueueStatus();
            QueueDataLiteral.Text = JsonConvert.SerializeObject(queueData);
        }
    }
}
