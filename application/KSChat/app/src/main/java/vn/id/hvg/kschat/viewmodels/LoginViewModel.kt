package vn.id.hvg.kschat.viewmodels

import android.util.Log
import android.view.View
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import vn.id.hvg.kschat.data.models.UserAccount
import vn.id.hvg.kschat.data.repositories.AuthRepository
import vn.id.hvg.kschat.utils.Utils
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(private val authRepository: AuthRepository) : ViewModel() {
    var emailLiveData = MutableLiveData<String>()
    var passwordLiveData = MutableLiveData<String>()

    var loginUserLiveData = MutableLiveData<UserAccount>()


    fun onClick(v: View) {
        Log.d(Utils.getTag(this),"on Login Btn Click called")
        val email = emailLiveData.value
        val password = passwordLiveData.value

        viewModelScope.launch(Dispatchers.Main) {
            authRepository.login(email.toString(),password.toString())
        }
    }


}