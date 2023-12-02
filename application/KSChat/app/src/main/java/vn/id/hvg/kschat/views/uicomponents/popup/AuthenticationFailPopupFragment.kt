package vn.id.hvg.kschat.views.uicomponents.popup

import android.app.Dialog
import android.os.Bundle
import android.view.Window
import androidx.appcompat.widget.AppCompatButton
import androidx.appcompat.widget.AppCompatTextView
import androidx.fragment.app.DialogFragment
import vn.id.hvg.kschat.R

class AuthenticationFailPopupFragment : DialogFragment() {
    companion object {
        internal const val NAME_KEY = "NAME_KEY"

        fun newInstance(
            name: String?
        ): AuthenticationFailPopupFragment {
            return AuthenticationFailPopupFragment().apply {
                arguments = Bundle().apply {
                    putString(NAME_KEY, name)
                }
            }
        }
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        val name = arguments?.getString(NAME_KEY).orEmpty()

        val dialog = context?.let { Dialog(it, R.style.AppThemeNew_DialogTheme) }
        dialog?.requestWindowFeature(Window.FEATURE_NO_TITLE)
        dialog?.setContentView(R.layout.layout_dialog_authentication_fail)
        dialog?.show()
        val content = dialog?.findViewById<AppCompatTextView>(R.id.tv_message)
        val button = dialog?.findViewById<AppCompatButton>(R.id.btn_accept)
        button?.setOnClickListener {
            dismiss()
        }

        content?.text = name

        return dialog!!
    }


}