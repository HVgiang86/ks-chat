package vn.id.hvg.kschat.views.screens

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.util.Log
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import dagger.hilt.android.AndroidEntryPoint
import vn.id.hvg.kschat.R
import vn.id.hvg.kschat.contants.RegisterState
import vn.id.hvg.kschat.databinding.ActivitySignUpBinding
import vn.id.hvg.kschat.utils.Utils
import vn.id.hvg.kschat.viewmodels.SignUpViewModel
import vn.id.hvg.kschat.views.uicomponents.popup.AuthenticationFailPopupFragment
import vn.id.hvg.kschat.views.uicomponents.popup.ErrorPopupFragment
import vn.id.hvg.kschat.views.uicomponents.popup.LoadingDialogPopupFragment
import vn.id.hvg.kschat.views.uicomponents.popup.LoginSuccessDialogFragment


@AndroidEntryPoint
class SignUpActivity : AppCompatActivity() {
    private val signUpViewModel: SignUpViewModel by viewModels()
    private lateinit var binding: ActivitySignUpBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        binding =
            DataBindingUtil.setContentView(this, R.layout.activity_sign_up) as ActivitySignUpBinding
        binding.signUpViewModel = signUpViewModel
        binding.lifecycleOwner = this

        observe()

    }

    private fun observe() {
        inputChangeObserve()
        isLoadingObserve()
        signUpStateObserve()
    }

    private fun inputChangeObserve() {
        signUpViewModel.emailLiveData.observe(this) {
            run {
                if (it.isNullOrEmpty()) {
                    binding.emailInputLayout.error = "Email address is required!"
                    binding.emailInputLayout.setEndIconDrawable(R.drawable.ic_invalid)
                } else if (!signUpViewModel.validateEmail()) {
                    binding.emailInputLayout.error = "Email address is invalid!"
                    binding.emailInputLayout.setEndIconDrawable(R.drawable.ic_invalid)
                } else {
                    binding.emailInputLayout.error = ""
                    binding.emailInputLayout.setEndIconDrawable(R.drawable.ic_valid)
                }
            }
        }

        signUpViewModel.passwordLiveData.observe(this) {
            run {
                if (it.isNullOrEmpty()) binding.passwordInputLayout.error = "Password is required!"
                else if (!signUpViewModel.validatePassword()) binding.passwordInputLayout.error =
                    "Password is invalid!"
                else binding.passwordInputLayout.error = ""
            }
        }

        signUpViewModel.confirmPasswordLiveData.observe(this) {
            run {
                if (it.isNullOrEmpty()) binding.confirmPasswordInputLayout.error =
                    "Confirm password is required!"
                else if (!signUpViewModel.validateConfirmPassword()) binding.confirmPasswordInputLayout.error =
                    "Confirm password not match!"
                else binding.confirmPasswordInputLayout.error = ""
            }
        }

        signUpViewModel.firstNameLiveData.observe(this) {
            run {
                if (it.isNullOrEmpty()) binding.firstNameInputLayout.error =
                    "First name is required!"
            }
        }
    }

    private fun signUpStateObserve() {
        signUpViewModel.signUpStateLiveData.observe(this) {
            if (it == null) return@observe
            dismissLoadingPopup()
            when (it) {
                RegisterState.SUCCESS -> {
                    showLoginSuccessDialog()
                    val delayTime = 2000L
                    Utils.delayFunction(::returnSignUpResult, delayTime)
                }

                RegisterState.BAD_REQUEST -> showBadRequestErrorDialog()
                RegisterState.UNKNOWN_ERROR -> showUnknownErrorDialog()
                RegisterState.NETWORK_ERROR -> showNetworkErrorDialog()
                RegisterState.USERNAME_TAKEN -> showEmailTakenPopup()
            }
        }
    }

    private fun isLoadingObserve() {
        signUpViewModel.isLoading.observe(this) { isLoading ->
            run {
                if (isLoading) showLoadingPopup()
            }
        }
    }

    private fun returnSignUpResult() {
        val data = Intent()
        Log.d("HAHA", "email ${signUpViewModel.emailLiveData.value}")
        data.putExtra(LoginActivity.EMAIL_BUNDLE_KEY, signUpViewModel.emailLiveData.value)
        data.putExtra(LoginActivity.PASSWORD_BUNDLE_KEY, signUpViewModel.passwordLiveData.value)
        setResult(RESULT_OK, data)
        finish()
    }

    private fun showEmailTakenPopup() {
        val authenticationFailPopup = AuthenticationFailPopupFragment.newInstance(
            "Email address has been already taken!"
        )
        authenticationFailPopup.isCancelable = false
        authenticationFailPopup.show(supportFragmentManager, "")
    }

    private fun showLoadingPopup() {
        val loadingPopup = LoadingDialogPopupFragment.newInstance("Signing you up!")
        loadingPopup.isCancelable = false
        loadingPopup.show(supportFragmentManager, "loading")
    }

    private fun dismissLoadingPopup() {
        val popup = supportFragmentManager.findFragmentByTag("loading")
        if (popup != null) {
            supportFragmentManager.beginTransaction().remove(popup).commit()
        }
    }

    private fun showNetworkErrorDialog() {
        val networkErrorPopup = ErrorPopupFragment.newInstance("Oops!", "A Network error occurred!")
        networkErrorPopup.isCancelable = false
        networkErrorPopup.show(supportFragmentManager, "")
    }

    private fun showUnknownErrorDialog() {
        val unknownErrorPopup =
            ErrorPopupFragment.newInstance("Oops!", "An unknown error occurred!")
        unknownErrorPopup.isCancelable = false
        unknownErrorPopup.show(supportFragmentManager, "")
    }

    private fun showBadRequestErrorDialog() {
        val unknownErrorPopup = ErrorPopupFragment.newInstance("Oops!", "Bad request!")
        unknownErrorPopup.isCancelable = false
        unknownErrorPopup.show(supportFragmentManager, "")
    }

    private fun showLoginSuccessDialog() {
        val loginSuccessPopup = LoginSuccessDialogFragment.newInstance("Sign up Success!")
        loginSuccessPopup.isCancelable = false
        loginSuccessPopup.show(supportFragmentManager, "signupSuccess")
    }



}