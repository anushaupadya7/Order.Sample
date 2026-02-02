/*
 * OrderList.js - Product Orders page functionality
 * Sample application with randomized mock data
 */

app.OrderListPage = function() {
    var _fields = {};
    var elements;

    function setValue(fieldName, value) {
        if (_fields[fieldName]) {
            _fields[fieldName].setValue(value);
        } else {
            console.error("setValue: Invalid field", fieldName);
        }
    }

    function getValue(fieldName) {
        if (!_fields[fieldName]) {
            console.error("getValue: Invalid field", fieldName);
            return null;
        }
        return _fields[fieldName].getValue();
    }

    var wrapTextField = app.form.wrapTextField;
    var wrapNumberField = app.form.wrapNumberField;
    var wrapComboBox = app.form.wrapComboBox;

    return {
        orderList: null,
        invalidParams: [],

        init: function(config) {
            elements = app.page.Elements;

            this.orderList = new app.OrderListBase({
                renderTo: 'list-grid',
                dataUrl: config.dataUrl,
                actionsEnabled: config.actionsEnabled,
                hasAdvancedFeatures: config.hasAdvancedFeatures,
                ordersGridId: config.ordersGridId,
                hasPendingOrders: config.hasPendingOrders,
                isTeaser: config.isTeaser,
                pendingOrdersData: config.pendingOrdersData,
                maxPendingOrders: config.maxPendingOrders
            });

            this.setupSearch(!!config.autoSearch);

            if (!config.isTeaser) {
                app.order.updateQueueStatus(config.queueData, 'queueStatus');
            }

            // Initialize pending orders if available
            if (config.hasPendingOrders && config.pendingOrdersData) {
                this.initPendingOrders(config.pendingOrdersData);
            }
        },

        initPendingOrders: function(pendingData) {
            var container = Ext.get('pendingOrdersCt');
            if (!container || !pendingData || !pendingData.items) return;

            var html = '<ul class="pending-orders-list">';
            Ext.each(pendingData.items, function(item) {
                html += '<li class="pending-order-item">';
                html += '<span class="priority">' + item.Priority + '</span>';
                html += '<span class="order-info">' + item.OrderNumber + ' - ' + item.ProductName + '</span>';
                html += '<span class="customer">' + item.CustomerName + '</span>';
                html += '<span class="total">' + app.util.currency(item.OrderTotal) + '</span>';
                html += '</li>';
            });
            html += '</ul>';
            html += '<div class="pending-orders-summary">' + pendingData.totalCount + ' of ' + pendingData.maxCount + ' pending</div>';

            container.update(html);
        },

        setupSearch: function(autoSearch) {
            var self = this;
            var input;

            var comboParams = {
                displayField: 'col',
                allowBlank: true,
                typeAhead: true,
                triggerAction: 'all',
                width: 150,
                mode: 'local',
                forceSelection: true
            };

            if ($d(elements.Category)) {
                input = wrapComboBox(elements.Category, comboParams);
                this._createField('CategoryId', input, 'select', autoSearch);
            }

            if ($d(elements.OrderStatus)) {
                input = wrapComboBox(elements.OrderStatus, comboParams);
                this._createField('StatusId', input, 'select', autoSearch);
            }

            if ($d(elements.Customer)) {
                input = wrapComboBox(elements.Customer, comboParams);
                this._createField('CustomerName', input, 'select', autoSearch);
            }

            if ($d(elements.MinOrderTotal)) {
                input = wrapNumberField(elements.MinOrderTotal, { allowDecimals: true });
                this._createField('MinimumOrderTotal', input, 'change', false);
            }

            if ($d(elements.MaxOrderTotal)) {
                input = wrapNumberField(elements.MaxOrderTotal, { allowDecimals: true });
                this._createField('MaximumOrderTotal', input, 'change', false);
            }

            if ($d(elements.MinQuantity)) {
                input = wrapNumberField(elements.MinQuantity, { allowDecimals: false });
                this._createField('MinimumQuantity', input, 'change', false);
            }

            if ($d(elements.DateRange)) {
                input = wrapComboBox(elements.DateRange, comboParams);
                this._createField('DateRangeDays', input, 'select', autoSearch);
            }
        },

        _createField: function(id, obj, event, search) {
            if (_fields[id]) {
                console.warn("Field already exists for id", id);
            }
            var field = (_fields[id] = app.form.FieldManager.create(id, obj, null, null, null));

            var self = this;
            if (event && obj && obj.on) {
                obj.on(event, function(evt) {
                    self._afterChangeValue(evt, obj, null, id, field, search);
                });
            }

            return field;
        },

        getFields: function() {
            return _fields;
        },

        _afterChangeValue: function(evt, obj, o, id, field, search) {
            // Update criteria
            app.page.criteria[id] = getValue(id);

            if (search) {
                this.tagSearch(id);
                this.doSearch();
            }
        },

        alterInvalidParams: function(field, isInvalid) {
            var ip = this.invalidParams;
            var fieldId = field && field.id ? field.id : field;
            var found = false;

            for (var i = 0; i < ip.length; i++) {
                if (ip[i] === fieldId) {
                    found = true;
                    if (!isInvalid) {
                        ip.splice(i, 1);
                    }
                    break;
                }
            }

            if (!found && isInvalid) {
                ip.push(fieldId);
            }
        },

        checkOrderListSearchParamsValidity: function() {
            return this.invalidParams.length === 0;
        },

        setMarginPercent: function(percent) {
            app.page.criteria['MarginPercentage'] = percent;
            this.doSearch();
        },

        doSearchFromButton: function() {
            // Collect all field values
            for (var fieldId in _fields) {
                if (_fields.hasOwnProperty(fieldId)) {
                    app.page.criteria[fieldId] = getValue(fieldId);
                }
            }

            this.tagSearch('searchBtn');
            this.doSearch();
        },

        doSearch: function() {
            if (!this.checkOrderListSearchParamsValidity()) {
                console.warn('Search params invalid');
                return;
            }

            if (this.orderList) {
                this.orderList.doSearch();
            }

            app.order.closeReportCard();
        },

        tagSearch: function(action) {
            console.warn('Action tagged:', action);
        },

        _dummy: null
    };
}();
