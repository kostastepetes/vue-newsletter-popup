<template>
  <div v-if="showPopup" class="newsletter-popup">
    <button @click="dismissPopup" class="close-button">X</button> <!-- Dismissal button -->
    <div v-if="!formSubmitted" class="newsletter-content">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <form @submit.prevent="submitForm">
        <input type="text" v-model="fullName" placeholder="Full Name" required class="input-field">
        <input type="email" v-model="email" placeholder="Email Address" required class="input-field">
        <div>
          <input type="checkbox" v-model="termsAccepted" required>
          <label for="termsAccepted">{{termsText}}<a href="{{termsUrl}}" target="_blank">Terms of Service</a></label>
        </div>
        <button type="submit" class="submit-button">{{ buttonText }}</button>
      </form>
    </div>
    <h3 v-else>{{ successMessage }}</h3> <!-- Display success message -->
  </div>
</template>

<script>
import { ref, watchEffect, onMounted } from 'vue';

export default {
  props: {
    timeOnpage: Number,
    exitIntent: Boolean,
    onClick: String,
    title: {
      type: String,
      default: 'Subscribe to Our Newsletter'
    },
    message: {
      type: String,
      default: 'Stay up-to-date with our latest news and updates.'
    },
    buttonText: {
      type: String,
      default: 'Submit'
    },
    termsAccepted: {
      type: Boolean,
      default: false
    },
    termsText: {
      type: String,
      default: 'I accept the '
    },
    termsUrl: {
      type: String,
      default: '/terms'
    } 
  },
  setup(props) {
    const showPopup = ref(false);
    const fullName = ref('');
    const email = ref('');
    const successMessage = ref(''); // New property for success message
    const formSubmitted = ref(false); // New property to track form submission
    const termsAccepted = ref(false); // New property for terms acceptance

    const showPopupAfterTime = () => {
      if (props.timeOnpage) {
        setTimeout(() => {
          showPopup.value = true;
        }, props.timeOnpage *   1000);
      }
    };

    const showPopupOnExitIntent = () => {
      if (props.exitIntent) {
        const handleExitIntent = () => {
          showPopup.value = true;
          window.removeEventListener('mouseout', handleExitIntent);
        };
        window.addEventListener('mouseout', handleExitIntent);
      }
    };

    const showPopupOnClick = () => {
      if (props.onClick) {
        const element = document.querySelector(props.onClick);
        if (element) {
          element.addEventListener('click', () => {
            showPopup.value = true;
          });
        } else {
          console.error('Element not found with selector:', props.onClick);
        }
      }
    };

    const submitForm = async () => {
  if (!termsAccepted.value) {
    // If the terms are not accepted, do not proceed with the form submission
    return;
  }

  // Prepare the data to be sent to the server
  const data = {
    fullName: fullName.value,
    email: email.value
  };

  try {
    // Send a POST request to the server-side script
    const response = await fetch('http://localhost:3000/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // Check if the request was successful
    if (response.ok) {
      // If successful, clear the form and show the success message
      fullName.value = '';
      email.value = '';
      termsAccepted.value = false;
      formSubmitted.value = true;
      successMessage.value = 'Thank you for subscribing!';
    } else {
      // Handle the error
      console.error('Error submitting the form:', response.statusText);
      fullName.value = '';
      email.value = '';
      termsAccepted.value = false;
      formSubmitted.value = true;
      successMessage.value = 'There was an error submitting your request. Please try again.';
    }
  } catch (error) {
    // Handle network errors
    console.error('Network error:', error);
    fullName.value = '';
    email.value = '';
    termsAccepted.value = false;
    formSubmitted.value = true;
    successMessage.value = 'There was a network error. Please try again.';
  }
};

    const dismissPopup = () => {
      showPopup.value = false;
    };

    watchEffect(() => {
      showPopupAfterTime();
      showPopupOnExitIntent();
    });

    onMounted(() => {
      showPopupOnClick();
    });

    return {
      showPopup,
      fullName,
      email,
      submitForm,
      successMessage, // Return successMessage
      formSubmitted, // Return formSubmitted
      termsAccepted, // Return termsAccepted
      dismissPopup // Return dismissPopup
    };
  }
};
</script>

<style scoped>
.newsletter-popup {
  position: fixed;
  top:   50%;
  left:   50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding:   20px;
  border:   1px solid #000000;
  box-shadow:   0   0   10px rgba(0,   0,   0,   0.1);
  z-index:   9999;
}

.newsletter-content {
  text-align: center;
}

.newsletter-content h2 {
  margin-bottom:   10px;
}

.newsletter-content p {
  margin-bottom:   20px;
}

.input-field {
  margin-bottom:   10px;
  padding:  10px;
  width:   80%;
  border:   1px solid #ccc;
  border-radius:   4px;
  margin-top: 10px;
}

.submit-button {
  padding:   8px   20px;
  background-color: #000000;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius:   4px;
  margin-top: 2rem;
}

.submit-button:hover {
  padding:   10px   22px;
  background-color: #9b9b9b;
}

.close-button {
  position: absolute;
  top:   2px;
  right:   1px;
  background: transparent;
  border: none;
  font-size:   20px;
  cursor: pointer;
}

.newsletter-content div {
  margin-bottom:  10px;
}

.newsletter-content input[type="checkbox"] {
  margin-right:  5px;
}
.newsletter-content label {
  display: inline-block;
  margin-left:   5px;
}
</style>