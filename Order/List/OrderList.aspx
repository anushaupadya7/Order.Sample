<%@ Page Language="C#" MasterPageFile="~/Share/MasterPages/Master.master" AutoEventWireup="true" Inherits="Order.Sample.Order.List.OrderList" Codebehind="OrderList.aspx.cs" %>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContent" runat="server">
    <link rel="stylesheet" href="~/Order/List/styles/Order.css" runat="server" />
    <link rel="stylesheet" href="~/Styles/Scale.css" runat="server" />
    <script type="text/javascript" src="~/Order/List/scripts/OrderListBase.js" runat="server"></script>
    <script type="text/javascript" src="~/Order/List/scripts/OrderList.js" runat="server"></script>
    <script type="text/javascript" src="~/Order/List/scripts/OrderList-grid.js" runat="server"></script>
</asp:Content>

<asp:Content ID="Content1" ContentPlaceHolderID="PageBody" runat="Server">
    <div style="width: 650px;">
        <div class="Instructions">
            <img src="~/images/icons/OrderModule48.png" runat="server" style="float: left; margin-right: 1em; width: 48px; height: 48px;" class="transp" alt="Product Orders" />
            <div style="float: left; width: 550px;">
                <h3 class="PageSectionTitle"><%= Page.Title %></h3>
                <asp:Literal ID="PageDescription" runat="server" />
                <a id="queueStatus" title="Click to Refresh"></a>
            </div>
            <div class="clear"></div>
        </div>
    </div>

    <table class="orderSearchTable">
        <tbody>
            <tr>
                <td class="searchTD">
                    <div class="MediumBlue search rounded-panel">
                        <h3>Search Orders</h3>
                        <div class="content">
                            <dl>
                                <dt>Category</dt>
                                <dd>
                                    <asp:DropDownList ID="CategoryDropDown" runat="server" />
                                </dd>
                                <dt>Order Status</dt>
                                <dd>
                                    <asp:DropDownList ID="OrderStatusDropDown" runat="server" />
                                </dd>
                                <dt>Customer</dt>
                                <dd>
                                    <asp:DropDownList ID="CustomerDropDown" runat="server" />
                                </dd>
                                <dt>Order Total</dt>
                                <dd class="ddTextbox">
                                    <asp:TextBox ID="MinOrderTotalTextBox" runat="server" CssClass="range" /> to
                                    <asp:TextBox ID="MaxOrderTotalTextBox" runat="server" CssClass="range" />
                                </dd>
                                <dt>Min Quantity</dt>
                                <dd class="ddTextbox">
                                    <asp:TextBox ID="MinQuantityTextBox" runat="server" CssClass="range" />
                                </dd>
                                <dt>
                                    <asp:Label ID="DateRangeDropDownLabel" runat="server" Text="Date Range" />
                                </dt>
                                <dd>
                                    <asp:DropDownList ID="DateRangeDropDown" runat="server" />
                                </dd>
                            </dl>
                        </div>
                        <div class="buttons">
                            <asp:Button ID="SearchButton" runat="server" Text="Search" CssClass="SearchButton" OnClientClick="app.OrderListPage.doSearchFromButton(); return false;" />
                        </div>
                    </div>
                </td>
                <td height="200px">
                    <div class="listTitle" height="24px" width="600px">
                        <div class="titleText FloatLeft">Product Orders</div>
                        <div id="filterDescription" class="filterText FloatLeft"></div>
                        <div class="FloatRight">
                            <div id="AutomatchImage" class="transp" height="19" width="202"></div>
                        </div>
                        <div class="ClearBoth"></div>
                    </div>
                    <div style="clear:both"></div>
                    <div id="list-grid" style="width: 600px;"></div>
                </td>
                <td class="cartTD">
                    <% if (HasPendingOrders) { %>
                    <div class="MediumBlue cart rounded-panel">
                        <h3><a href="#">Pending Orders</a></h3>
                        <div class="content">
                            <div id="pendingOrdersCt" class="content"></div>
                        </div>
                    </div>
                    <% } %>
                </td>
            </tr>
        </tbody>
    </table>

    <script type="text/javascript">
        app.page.criteria = <asp:Literal ID="CriteriaLiteral" runat="server" EnableViewState="false" />;
        app.page.initialOrderListData = <asp:Literal ID="InitialDataLiteral" runat="server" EnableViewState="false" />;
        app.page.c = true;
        app.page.uom = "mi";
        app.page.Elements = {
            Category: '<%= CategoryDropDown.ClientID %>',
            OrderStatus: '<%= OrderStatusDropDown.ClientID %>',
            Customer: '<%= CustomerDropDown.ClientID %>',
            MinOrderTotal: '<%= MinOrderTotalTextBox.ClientID %>',
            MaxOrderTotal: '<%= MaxOrderTotalTextBox.ClientID %>',
            MinQuantity: '<%= MinQuantityTextBox.ClientID %>',
            DateRange: '<%= DateRangeDropDown.ClientID %>'
        };

        Ext.onReady(function() {
            Ext.each(Ext.DomQuery.select('.InitialHidden'), function(node) {
                Ext.get(node).removeClass('InitialHidden');
            });

            app.OrderListPage.init({
                actionsEnabled: true,
                autoSearch: true,
                hasAdvancedFeatures: <%= HasAdvancedFeatures ? "true" : "false" %>,
                ordersGridId: 'sample-grid-id',
                hasPendingOrders: <%= HasPendingOrders ? "true" : "false" %>,
                isTeaser: false,
                pendingOrdersData: <asp:Literal ID="PendingOrdersDataLiteral" runat="server" EnableViewState="false" />,
                dataUrl: '<%= ResolveClientUrl("~/Order/List/OrderData.ashx") %>',
                queueData: <asp:Literal ID="QueueDataLiteral" runat="server" EnableViewState="false" />,
                maxPendingOrders: 25
            });
        });
    </script>
</asp:Content>
