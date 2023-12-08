package vn.id.hvg.kschat.viewmodels

import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import vn.id.hvg.kschat.data.repositories.AuthRepository
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(private val authRepository: AuthRepository) :
    ViewModel() {
}