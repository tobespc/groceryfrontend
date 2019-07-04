var store = (function() {
    var data = [];
    var selectedID = '';
    var overflowMenus = [];
    var renderTable = function() {

        for (var i=0; i<overflowMenus.length; i++){
            CarbonComponents.OverflowMenu.components.get(overflowMenus[i]).release();
        }
        overflowMenus = [];
        $.ajax({
            type: 'GET',
            url: '/store/api/v1/items',
            crossDomain: true,
            success:function(response){ 
                $('tbody').empty();
                console.log(response);
                data = response;
                renderTableRows();
                var table = $('.table');
                sortTable(table, 1, true);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            // do nothing for now
        });

        $("#search__input-2").val('');
        $("#search-cancel").addClass('bx--search-close--hidden');
        $(".bx--table-sort-v2").removeClass("bx--table-sort-v2--active");
        $(".bx--table-sort-v2").removeClass("bx--table-sort-v2--ascending");
        $(".bx--table-sort-v2").removeAttr("sort-previous-value");
        $(".bx--table-sort-v2").removeAttr("data-previous-value");
    };

    function renderTableRows() {
        if (data && data.length > 0){
            var statusNumber = 0;
            var status = '';
            var html = '';
            
            for (var i=0; i<data.length; i++){
                /* ADD STATUS FEATURE HERE - JavaScript Logic */
                if (data[i].id && data[i].price && data[i].quantity){
                    if(data[i].quantity < 10){
                        statusNumber = 0;
                        status = '<img src="img/warning.svg" class="status-warning">';
                    }
                    else {
                        statusNumber = 1;
                        status = '<img src="img/checkmark.svg" class="status-ok">';
                    }

                    html = '<tr class="table-row"><td status-number="' + statusNumber + '">' + status +
                    '</td>' + 
                    '<td class="table-name">' + escapeHtml(data[i].id) + '</td>' + 
                    '<td>' + escapeHtml(data[i].price) + '</td>' +
                    '<td>' + escapeHtml(data[i].quantity) + '</td>' +
                    '<td class="bx--table-overflow">\
                        <div id="overflow-menu-' + i +'" data-overflow-menu tabindex="0" aria-label="Overflow menu description" class="bx--overflow-menu">\
                            <svg class="bx--overflow-menu__icon" width="3" height="15" viewBox="0 0 3 15">\
                                <g fill-rule="evenodd">\
                                <circle cx="1.5" cy="1.5" r="1.5" />\
                                <circle cx="1.5" cy="7.5" r="1.5" />\
                                <circle cx="1.5" cy="13.5" r="1.5" />\
                                </g>\
                            </svg>\
                            <ul class="bx--overflow-menu-options bx--overflow-menu--flip">\
                                <li class="bx--overflow-menu-options__option">\
                                <button class="bx--overflow-menu-options__btn overflow-menu-item" data-action="edit" data-id="' + data[i].id + '" data-price="' + data[i].price + '" data-quantity="' + data[i].quantity +'">Edit</button>\
                                </li>\
                                <li class="bx--overflow-menu-options__option">\
                                <button class="bx--overflow-menu-options__btn overflow-menu-item" data-action="delete" data-id="' + data[i].id +'">Delete</button>\
                                </li>\
                            </ul>\
                        </div>\
                    </td></tr>';

                    $('tbody').append(html);

                    var overflowMenu = document.querySelector('#overflow-menu-' + i);
                    overflowMenus.push(overflowMenu);
                    CarbonComponents.OverflowMenu.create(overflowMenu);
                }
            }
        }
        return html;
    };

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function showAddModal(){
        CarbonComponents.Modal.components.get($('.add-modal').get(0)).show();
        $('#add-id-input').val('');
        $('#add-price-input').val('');
        $('#add-quantity-input').val('');
        $('.add-modal .add-error-notification').hide();
        $('.add-modal .add-error-notification .error-message').text('');
    }

    function showEditModal(){
        CarbonComponents.Modal.components.get($('.edit-modal').get(0)).show();
        $('#edit-id-input').val(selectedID);
        $('#edit-price-input').val(selectedPrice);
        $('#edit-quantity-input').val(selectedQuantity);
        $('.edit-modal .add-error-notification').hide();
        $('.edit-modal .add-error-notification .error-message').text('');
    }

    function validateAddModal(){
        var isValid = true;
        var errorMsg = '';
        var regex=/^[0-9]+$/;

        if (!$('#add-quantity-input').val().match(regex) || parseInt($('#add-quantity-input').val()) < 0){
            errorMsg = 'Quantity must be an integer greater than 0';
            isValid = false;
        }
        else if (isNaN($('#add-price-input').val()) || parseFloat($('#add-price-input').val()) < 0){
            errorMsg = 'Price must be a number greater than 0';
            isValid = false;
        }
        else if ($('#add-id-input').val().length == 0){
            errorMsg = 'Name cannot be empty';
            isValid = false;
        }
        else {
            for (var i=0; i<data.length; i++){
                if (data[i].id == $('#add-id-input').val()){
                    errorMsg = 'Name already exists';
                    isValid = false;
                    break;
                }
            }
        }

        if (!isValid){
            $('.add-modal .add-error-notification .error-message').text(errorMsg);
            $('.add-modal .add-error-notification').show();
        }
        else {
            $('.add-modal .add-error-notification').hide();
            $.ajax({
                method: 'PUT',
                url: '/store/api/v1/items/' + $('#add-id-input').val() + '/' + $('#add-quantity-input').val() + '/' + $('#add-price-input').val(),
                crossDomain: true,
                success:function(response){ 
                    CarbonComponents.Modal.components.get($('.add-modal').get(0)).hide();
                    renderTable();
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                // do nothing for now
            });
        }
    }

    function validateEditModal(){
        var isValid = true;
        var errorMsg = '';
        var regex=/^[0-9]+$/;

        if (!$('#edit-quantity-input').val().match(regex) || parseInt($('#edit-quantity-input').val()) < 0){
            errorMsg = 'Quantity must be an integer greater than 0';
            isValid = false;
        }
        else if (isNaN($('#edit-price-input').val()) || parseFloat($('#edit-price-input').val()) < 0){
            errorMsg = 'Price must be a number greater than 0';
            isValid = false;
        }
        else if ($('#edit-id-input').val().length == 0){
            errorMsg = 'Name cannot be empty';
            isValid = false;
        }
        else {
            var nameExist = false;

            for (var i=0; i<data.length; i++){
                if (data[i].id == $('#edit-id-input').val()){
                    nameExist = true;
                    break;
                }
            }

            if (!nameExist) {
                errorMsg = 'Name does not exist';
                isValid = false;
            }
        }

        if (!isValid){
            $('.edit-modal .add-error-notification .error-message').text(errorMsg);
            $('.edit-modal .add-error-notification').show();
        }
        else {
            $('.edit-modal .add-error-notification').hide();
            $.ajax({
                method: 'POST',
                url: '/store/api/v1/price/' + $('#edit-id-input').val() + '/' +  $('#edit-price-input').val(),
                crossDomain: true,
                success:function(response){ 
                    $.ajax({
                        method: 'POST',
                        url: '/store/api/v1/quantity/' + $('#edit-id-input').val() + '/' +  $('#edit-quantity-input').val(),
                        crossDomain: true,
                        success:function(response){ 
                            CarbonComponents.Modal.components.get($('.edit-modal').get(0)).hide();
                            renderTable();
                        }
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        // do nothing for now
                    });
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                // do nothing for now
            });
        }
    }

    $('document').ready(function() {
        store.renderTable();
        var addModal = $('.add-modal');
        CarbonComponents.Modal.create(addModal.get(0));

        var editModal = $('.edit-modal');
        CarbonComponents.Modal.create(editModal.get(0));

        /* ADD DELETE ITEM FEATURE HERE - CREATE MODAL */
        var deleteModal = $('.delete-modal');
        CarbonComponents.Modal.create(deleteModal.get(0));

        $('body').on('click', '.overflow-menu-item', function(event) {
            selectedID = event.currentTarget.dataset.id;
            selectedPrice = event.currentTarget.dataset.price;
            selectedQuantity = event.currentTarget.dataset.quantity;
            if (event.currentTarget.dataset.action == 'delete'){
                /* ADD DELETE ITEM FEATURE HERE - CALL MODAL */
                CarbonComponents.Modal.components.get($('.delete-modal').get(0)).show();
                $('.delete-modal .description').text('Are you sure you want to delete the item ' + escapeHtml(selectedID) + '?');
            } else if (event.currentTarget.dataset.action == 'edit') {
                showEditModal();
            }
        });

        $('#add-new-button').on('click', function(){
            showAddModal();
        });

        $('#add-modal-cancel-button').on('click', function(){
            CarbonComponents.Modal.components.get($('.add-modal').get(0)).hide();
        });

        $('#add-modal-add-item-button').on('click', function(){
            if (validateAddModal()){
                CarbonComponents.Modal.components.get($('.add-modal').get(0)).hide();
            }
        });

        $('#edit-modal-cancel-button').on('click', function(){
            CarbonComponents.Modal.components.get($('.edit-modal').get(0)).hide();
        });

        $('#edit-modal-edit-item-button').on('click', function(){
            if (validateEditModal()){
                CarbonComponents.Modal.components.get($('.edit-modal').get(0)).hide();
            }
        });

        /* ADD DELETE ITEM FEATURE HERE - CALL BACKEND DELETE FUNCTION */
        $('#delete-modal-yes-button').on('click', function(){
            $.ajax({
                method: 'DELETE',
                url: '/store/api/v1/item/' + selectedID,
                crossDomain: true,
                success:function(response){ 
                    renderTable();
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                // do nothing for now
            }).done(function(){
                CarbonComponents.Modal.components.get($('.delete-modal').get(0)).hide();
            });
        });

        $('#delete-modal-no-button').on('click', function(){
            CarbonComponents.Modal.components.get($('.delete-modal').get(0)).hide();
        });
    });

    $("#search__input-2").on("keyup", function() {
        var g = $(this).val();
        $(".table-row .table-name").each( function() {
            var s = $(this).text();
            if (g.length == 0 || (s.indexOf(g) != -1 && s.charAt(0) == g.charAt(0))) {
                $(this).parent().show();
            } else {
                $(this).parent().hide();
            }
        });
    });

    $(".bx--search-close").on("click", function() {
        var g = $(this).val();
        $(".table-row .table-name").each( function() {
            var s = $(this).text();
            if (g.length == 0 || (s.indexOf(g) != -1 && s.charAt(0) == g.charAt(0))) {
                $(this).parent().show();
            } else {
                $(this).parent().hide();
            }
        });
    });

    $('.bx--table-sort-v2').on('click', function() {
        var table = $('.table'); 
        var th = $(this).parent();
        
        var prevValue = $(this).attr("sort-previous-value");
    
        var doAscendingOrder = undefined;
    
        if (prevValue == undefined) {
            prevValue = "ascending";
        }
    
        if (prevValue == "ascending") {
            doAscendingOrder = false;
            $(this).attr("sort-previous-value", "descending");
        } else if (prevValue == "descending") {
            doAscendingOrder = true;
            $(this).attr("sort-previous-value", "ascending");
        }
    
        sortTable(table, th.index(), doAscendingOrder);
    });
    
    function sortTable(table, column, doAscendingOrder) {
        var tbody = table.find('tbody');
        tbody.find('tr').sort(function (a, b) {
            if (doAscendingOrder) {
                if (column == 0) {
                    return $('td:eq(' + column + ')', a).attr("status-number").localeCompare($('td:eq(' + column + ')', b).attr("status-number"));
                } else if (column == 1) {
                    return $('td:eq(' + column + ')', a).text().localeCompare($('td:eq(' + column + ')', b).text());
                } else {
                    return numberCompare(parseFloat($('td:eq(' + column + ')', a).text()), parseFloat($('td:eq(' + column + ')', b).text()));
                }
            } else {
                if (column == 0) {
                    return $('td:eq(' + column + ')', b).attr("status-number").localeCompare($('td:eq(' + column + ')', a).attr("status-number"));
                } else if (column == 1) {
                    return $('td:eq(' + column + ')', b).text().localeCompare($('td:eq(' + column + ')', a).text());
                } else {
                    return numberCompare(parseFloat($('td:eq(' + column + ')', b).text()), parseFloat($('td:eq(' + column + ')', a).text()));
                }
            }
        }).appendTo(tbody);
    }
    
    function numberCompare (num1, num2) {
        if (num1 > num2) {
            return 1;
        } else if (num1 < num2) {
            return -1;
        } else {
            return 0;
        }
    }

    return {
        name: 'store',
        renderTable: renderTable
    };
}());