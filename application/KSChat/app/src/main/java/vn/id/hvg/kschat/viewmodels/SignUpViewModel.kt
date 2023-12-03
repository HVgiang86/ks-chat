package vn.id.hvg.kschat.viewmodels

import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import vn.id.hvg.kschat.contants.EMAIL_REGEX
import vn.id.hvg.kschat.contants.NAME_REGEX
import vn.id.hvg.kschat.contants.PASSWORD_REGEX
import vn.id.hvg.kschat.contants.RegisterState
import vn.id.hvg.kschat.data.repositories.AuthRepository
import java.util.regex.Pattern
import javax.inject.Inject

@HiltViewModel
class SignUpViewModel @Inject constructor(private val authRepository: AuthRepository) :
    ViewModel() {
    var firstNameLiveData = MutableLiveData<String>()
    var lastNameLiveData = MutableLiveData<String>()
    var confirmPasswordLiveData = MutableLiveData<String>()
    var emailLiveData = MutableLiveData<String>()
    var passwordLiveData = MutableLiveData<String>()

    var signUpStateLiveData = MutableLiveData<RegisterState>()
    var isLoading = MutableLiveData<Boolean>()

    init {
        isLoading.value = false
    }

    fun onSignupClick() {
        viewModelScope.launch {
            withContext(Dispatchers.IO) {
                register()
            }
        }
    }

    fun validateEmail(): Boolean {
        val email = emailLiveData.value
        val patternEmail = Pattern.compile(EMAIL_REGEX)
        return patternEmail.matcher(email.toString()).matches()
    }

    private suspend fun register() {
        if (isLoading.value == true) return
        triggerInputDataChangeIfEmpty()
        if (!validateEmail() || !validatePassword() || !validateConfirmPassword()) return
        if (!validateFirstName()) return

        isLoading.postValue(true)
        val email = emailLiveData.value
        val password = passwordLiveData.value

        authRepository.register(email.toString(), password.toString(), signUpStateLiveData)
        isLoading.postValue(false)
    }

    fun validatePassword(): Boolean {
        val password = passwordLiveData.value
        val patternPassword = Pattern.compile(PASSWORD_REGEX)
        return patternPassword.matcher(password.toString()).matches()
    }

    fun validateConfirmPassword(): Boolean {
        val password = passwordLiveData.value
        val confirmPassword = confirmPasswordLiveData.value
        return password == confirmPassword
    }

    private fun triggerInputDataChangeIfEmpty() {
        if (emailLiveData.value.isNullOrEmpty())
            emailLiveData.postValue("")
        if (passwordLiveData.value.isNullOrEmpty()) passwordLiveData.postValue("")
        if (confirmPasswordLiveData.value.isNullOrEmpty()) confirmPasswordLiveData.postValue("")
    }

    private fun validateFirstName() : Boolean {
        val firstName = firstNameLiveData.value
        if (firstName.isNullOrEmpty()) return false
        return true
    }
}