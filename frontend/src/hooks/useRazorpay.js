const useRazorpay = () => {

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const openPayment = async ({
    order_id,
    amount,
    key_id,
    user,
    onSuccess,
    onFailure
  }) => {

    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      alert('Razorpay SDK failed to load');
      return;
    }

    const options = {
      key: key_id,
      amount: amount,
      currency: 'INR',
      name: 'TurfBook',
      description: 'Turf Slot Booking',
      order_id: order_id,

      prefill: {
        name: user?.name || '',
        email: user?.email || '',
      },

      theme: {
        color: '#22c55e'
      },

      handler: function (response) {
        onSuccess(response);
      },

      modal: {
        ondismiss: function () {
          onFailure('Payment cancelled by user');
        }
      }
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      onFailure(response.error.description || 'Payment failed');
    });

    rzp.open();
  };

  return { openPayment };
};

export default useRazorpay;