package vn.id.hvg.kschat.viewmodels

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import vn.id.hvg.kschat.contants.EMAIL_REGEX
import vn.id.hvg.kschat.contants.LoginState
import vn.id.hvg.kschat.contants.PASSWORD_REGEX
import vn.id.hvg.kschat.data.repositories.AuthRepository
import java.util.regex.Pattern
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(private val authRepository: AuthRepository) : ViewModel() {
    var emailLiveData = MutableLiveData<String>()
    var passwordLiveData = MutableLiveData<String>()

    var loginStateLiveData = MutableLiveData<LoginState>()
    var isLoading = MutableLiveData<Boolean>()

    init {
        isLoading.value = false
    }

    fun onLoginClick() {
        viewModelScope.launch {
            withContext(Dispatchers.IO) {
                login()
            }
        }
    }

    private suspend fun login() {
        if (isLoading.value == true) return
        if (!validateEmail() || !validatePassword()) return

        isLoading.postValue(true)
        val email = emailLiveData.value
        val password = passwordLiveData.value

        authRepository.login(email.toString(), password.toString(), loginStateLiveData)
        isLoading.postValue(false)
    }

    fun validateEmail(): Boolean {
        val email = emailLiveData.value
        val patternEmail = Pattern.compile(EMAIL_REGEX)
        return patternEmail.matcher(email.toString()).matches()
    }

    fun validatePassword(): Boolean {
        val password = passwordLiveData.value
        val patternPassword = Pattern.compile(PASSWORD_REGEX)
        return patternPassword.matcher(password.toString()).matches()
    }


}

