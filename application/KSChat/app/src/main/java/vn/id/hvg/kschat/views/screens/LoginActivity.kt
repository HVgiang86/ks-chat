package vn.id.hvg.kschat.views.screens

import android.os.Bundle
import android.util.Log
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import dagger.hilt.android.AndroidEntryPoint
import vn.id.hvg.kschat.R
import vn.id.hvg.kschat.databinding.ActivityLoginBinding
import vn.id.hvg.kschat.utils.Utils
import vn.id.hvg.kschat.viewmodels.LoginViewModel

@AndroidEntryPoint
class LoginActivity : AppCompatActivity() {
    private val loginViewModel: LoginViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        loginViewModel
        val viewBinding = ActivityLoginBinding.inflate(layoutInflater)

        viewBinding.btnLogin.setOnClickListener {
            Log.d(Utils.getTag(this),"clicked")
            loginViewModel.onClick(it)
        }

        setContentView(viewBinding.root)
    }

}