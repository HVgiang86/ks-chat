package vn.id.hvg.kschat.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import vn.id.hvg.kschat.data.repositories.AuthRepository
import vn.id.hvg.kschat.data.repositories.UserRepository
import javax.inject.Inject

@HiltViewModel
class ChatListModel @Inject constructor(private val authRepository: AuthRepository, private val userRepository: UserRepository) :
    ViewModel() {


    init {
        viewModelScope.launch {
            withContext(Dispatchers.IO) {
                getProfile()
            }
        }
    }

    private suspend fun getProfile() {
        val result = userRepository.getMyProfile()

    }
}