package vn.id.hvg.kschat.views.screens

import android.content.Intent
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
import vn.id.hvg.kschat.utils.Utils
import vn.id.hvg.kschat.viewmodels.LoginViewModel
import vn.id.hvg.kschat.views.uicomponents.popup.AuthenticationFailPopupFragment
import vn.id.hvg.kschat.views.uicomponents.popup.ErrorPopupFragment
import vn.id.hvg.kschat.views.uicomponents.popup.LoadingDialogPopupFragment
import vn.id.hvg.kschat.views.uicomponents.popup.LoginSuccessDialogFragment

@AndroidEntryPoint
class LoginActivity : AppCompatActivity() {
    private val loginViewModel: LoginViewModel by viewModels()
    private lateinit var binding: ActivityLoginBinding

    companion object {
        const val SIGN_UP_REQUEST_CODE = 10001
        const val EMAIL_BUNDLE_KEY = "vn.id.hvg.KSChat.bundle.email"
        const val PASSWORD_BUNDLE_KEY = "vn.id.hvg.KSChat.bundle.password"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding =
            DataBindingUtil.setContentView(this, R.layout.activity_login) as ActivityLoginBinding

        binding.signUpTv.setOnClickListener {
            openSignUpScreen()
        }

        binding.loginViewModel = loginViewModel
        binding.lifecycleOwner = this

        observe()
    }

    private fun observe() {
        isLoadingObserve()
        loginStateObserve()
        inputChangeObserve()
    }

    private fun inputChangeObserve() {
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
                if (isLoading) showLoadingPopup()
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
                        LoginState.SUCCESS -> {
                            showLoginSuccessDialog()
                            val delayTime = 2000L
                            Utils.delayFunction(::openMainActivityClearBackstack, delayTime)
                        }
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

    private fun openSignUpScreen() {
        val intent = Intent(this, SignUpActivity::class.java)
        @Suppress("DEPRECATION") startActivityForResult(intent, SIGN_UP_REQUEST_CODE)
    }

    @Deprecated("Deprecated in Java")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == SIGN_UP_REQUEST_CODE && resultCode == RESULT_OK) {
            val email = data?.getStringExtra(EMAIL_BUNDLE_KEY)
            val password = data?.getStringExtra(PASSWORD_BUNDLE_KEY)
            loginViewModel.emailLiveData.value = email
            loginViewModel.passwordLiveData.value = password
        }
    }

    private fun openMainActivityClearBackstack() {
        val intent = Intent(this, MainActivity::class.java)
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        startActivity(intent)
    }
}