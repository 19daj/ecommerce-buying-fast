function isValid() {
    return document.querySelector('#check').checked;
}

function onChangeCheckbox(handler) {
    document.querySelector('#check').addEventListener('change', handler);
}

function toggleValidationMessage() {
    document.querySelector('#msg').style.display = (isValid() ? 'none' : 'block');
}

function toggleButton(actions) {
    return isValid() ? actions.enable() : actions.disable();
}

// Render the PayPal button
paypal.Button.render({
    // Set your environment
    env: 'sandbox', // sandbox | production

    // PayPal Client IDs - replace with your own
    // Create a PayPal app: https://developer.paypal.com/developer/applications/create

    client: {
        sandbox: 'AQtJuLu8_cDT5v_zHIzWcyTN2NvO7_clRK6Y287l1d3pFtYV8ffUIH8xvyWF1BUddWM1m1IrgJ2F0xep',
        production: 'Ac6VCrmoce9fvtWDFmjl2SnoL0HQ54YK7jn0x9pG1c4-cvzGFOweT42VbeXOgr1m76lRw4JqJIMaHIpz'
    },

    validate: function (actions) {
        toggleButton(actions);

        onChangeCheckbox(function () {
            toggleButton(actions);
        });
    },

    onClick: function () {
        toggleValidationMessage();
    },

    // Wait for the PayPal button to be clicked
    payment: function (data, actions) {
        // Make a client-side call to the REST api to create the payment
        return actions.payment.create({
            payment: {
                transactions: [
                    {
                        amount: { total:'0.01', currency: 'USD' }
                    }
                ]
            }
        });
    },

    // Wait for the payment to be authorized by the customer
    onAuthorize: function (data, actions) {
        // Execute the payment
        return actions.payment.execute().then(function () {
            window.alert('Payment Complete!');
        });
    }
}, '#paypal-button');

