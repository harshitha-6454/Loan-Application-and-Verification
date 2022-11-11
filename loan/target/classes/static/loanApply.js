var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    const userId = localStorage.getItem("userId");
    $scope.provider = localStorage.getItem("provider");
    var URL = "https://fir-1c7de-default-rtdb.firebaseio.com";
    $scope.orderDetails = {};
    $(".loan-section").show();
    $("#biilingId").hide();
    $scope.viewOrderTableData = [];
    $scope.loanType = function (data) {
        $scope.loanType = data;
    }
    $scope.applyLoan = function () {
        if (checkIsNull($("#userNameId").val()) || checkIsNull($("#OccupationModel").val())
            || checkIsNull($("#loanAmountId").val()) || checkIsNull($("#userEmailId").val())
            || checkIsNull($("#contactId").val()) || checkIsNull($("#location").val())) {
            alert("Please fill all the required data");
        } else {
            let reqstBody = {
                "userNameId": $("#userNameId").val(),
                "OccupationModel": $("#OccupationModel").val(),
                "loanAmountId": $("#loanAmountId").val(),
                "userEmailId": $("#userEmailId").val(),
                "contactId": $("#contactId").val(),
                "location": $("#location").val(),
                "applyDate": new Date().toISOString().split('T')[0],
                "status": "pending",
                "loanType": $scope.loanType
            };
            $.ajax({
                type: 'post',
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: URL + "/applyLoan/" + userId + ".json",
                data: JSON.stringify(reqstBody),
                success: function (response) {
                    $('#placeOrderModalId').modal('hide');
                    $scope.switchMenu("BILLING", "billingTabId");
                    alert("Request applied sucessfully!!!");
                }, error: function (error) {
                    alert("Something went wrong");
                }
            });
        }
    }
    $scope.getOrderTableData = function (type) {
        $scope.viewOrderTableData = [];
        let orderList = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/applyLoan/" + userId + ".json",
            success: function (response) {
                for (let i in response) {
                    let eventData = response[i];
                    eventData["orderId"] = i;
                    orderList.push(eventData);
                }
                $scope.viewOrderTableData = orderList;
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.getLoanAdminTableData = function (type) {
        $scope.viewOrderTableData = [];
        let orderList = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/applyLoan.json",
            success: function (response) {
                for (let data in response) {
                    //let eventData = response[data];

                    //orderList.push(eventData);
                    for (let x in response[data]) {
                        let eventData = response[data][x];
                        eventData["orderId"] = data;
                        eventData["childOrderId"] = x;
                        orderList.push(eventData);
                    }
                }
                $scope.viewOrderTableData = orderList;
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.getOrderData = function (data) {
        $("#ammountId").val(data.price);
        $scope.orderDetails = data;

    }
    $scope.logout = function () {
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
        window.location.href = "loginRegLoanApply.html";
    }
    $scope.switchMenu = function (type, id) {
        $(".menuCls").removeClass("active");
        $('#' + id).addClass("active");
        $(".loan-section").hide();
        $("#biilingId").hide();
        if (type == "MENU") {
            $(".loan-section").show();
        } else if (type == "BILLING") {
            $("#biilingId").show();
            $scope.provider == 'true' ? $scope.getLoanAdminTableData() : $scope.getOrderTableData("BILLING");

        }
    }
    $scope.loanApprovalStatus = function (data, model) {
        let requestBody = {
            "status": model
        }
        $.ajax({
            type: 'patch',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/applyLoan/" + data.orderId + "/" + data.childOrderId + ".json",
            data: JSON.stringify(requestBody),
            success: function (response) {
                $('#processToPayModalId').modal('hide');
                $scope.getLoanAdminTableData();
                alert("Data updated sucessfully!!!");
            }, error: function (error) {
                alert("Something went wrong");
            }
        });

    }
    function checkIsNull(value) {
        return value === "" || value === undefined || value === null ? true : false;
    }
});
