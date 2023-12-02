package vn.id.hvg.kschat.views.screens

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.Observer
import dagger.hilt.android.AndroidEntryPoint
import vn.id.hvg.kschat.R
import vn.id.hvg.kschat.contants.LoginState
import vn.id.hvg.kschat.databinding.ActivityLoginBinding
import vn.id.hvg.kschat.viewmodels.LoginViewModel
import vn.id.hvg.kschat.views.uicomponents.popup.AuthenticationFailPopupFragment
import vn.id.hvg.kschat.views.uicomponents.popup.ErrorPopupFragment
import vn.id.hvg.kschat.views.uicomponents.popup.LoadingDialogPopupFragment
import vn.id.hvg.kschat.views.uicomponents.popup.LoginSuccessDialogFragment

@AndroidEntryPoint
class LoginActivity : AppCompatActivity() {
    private val loginViewModel: LoginViewModel by viewModels()
    private lateinit var binding: ActivityLoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        loginViewModel
        enableEdgeToEdge()
        binding =
            DataBindingUtil.setContentView(this, R.layout.activity_login) as ActivityLoginBinding

        binding.loginViewModel = loginViewModel
        binding.lifecycleOwner = this

        observe()
    }

    private fun observe() {
        isLoadingObserve()
        loginStateObserve()
        inputChangePasswordObserve()
    }

    private fun inputChangePasswordObserve() {
        loginViewModel.emailLiveData.observe(this) {
            run {
                if (it.isNullOrEmpty()) {
                    binding.emailInputLayout.error = "Email address is required!"
                    binding.emailInputLayout.setEndIconDrawable(R.drawable.ic_invalid)
                } else if (!loginViewModel.validateEmail()) {
                    binding.emailInputLayout.error = "Email address is invalid!"
                    binding.emailInputLayout.setEndIconDrawable(R.drawable.ic_invalid)
                } else {
                    binding.emailInputLayout.error = ""
                    binding.emailInputLayout.setEndIconDrawable(R.drawable.ic_valid)
                }
            }
        }

        loginViewModel.passwordLiveData.observe(this) {
            run {
                if (it.isNullOrEmpty()) binding.passwordInputLayout.error = "Password is required!"
                else if (!loginViewModel.validatePassword()) binding.passwordInputLayout.error =
                    "Password is invalid!"
                else binding.passwordInputLayout.error = ""
            }
        }
    }

    private fun isLoadingObserve() {
        loginViewModel.isLoading.observe(this) { isLoading ->
            run {
                if (isLoading) {
                    showLoadingPopup()
                }
            }
        }
    }

    private fun loginStateObserve() {
        loginViewModel.loginStateLiveData.observe(this, Observer {
            run {

                if (it == null) {
                    return@Observer
                } else {
                    dismissLoadingPopup()
                    when (it) {
                        LoginState.SUCCESS -> showLoginSuccessDialog()
                        LoginState.INCORRECT_CREDENTIALS -> showIncorrectCredentialsDialog()
                        LoginState.NETWORK_ERROR -> showNetworkErrorDialog()
                        LoginState.UNKNOWN_ERROR -> showUnknownErrorDialog()
                    }
                }
            }
        })
    }

    private fun showLoadingPopup() {
        val loadingPopup = LoadingDialogPopupFragment.newInstance("Logging you in!")
        loadingPopup.isCancelable = false
        loadingPopup.show(supportFragmentManager, "loading")

    }

    private fun showIncorrectCredentialsDialog() {
        val authenticationFailPopup = AuthenticationFailPopupFragment.newInstance(
            "Email or password incorrect!"
        )
        authenticationFailPopup.isCancelable = false
        authenticationFailPopup.show(supportFragmentManager, "")

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

    private fun showLoginSuccessDialog() {
        val loginSuccessPopup = LoginSuccessDialogFragment.newInstance("Login Success!")
        loginSuccessPopup.isCancelable = false
        loginSuccessPopup.show(supportFragmentManager, "loginSuccess")
    }

    private fun dismissLoadingPopup() {
        val popup = supportFragmentManager.findFragmentByTag("loading")
        if (popup != null) {
            supportFragmentManager.beginTransaction().remove(popup).commit()
        }
    }
}