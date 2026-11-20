using UnityEngine;

public class ChangeGroundColor : MonoBehaviour
{
    public FlexibleColorPicker colorPicker;
    public Renderer targetRenderer;

    void Start()
    {
        if (colorPicker != null && targetRenderer != null)
        {
            colorPicker.onColorChange.AddListener(OnColorChanged);
        }
    }

    void OnColorChanged(Color newColor)
    {
        if (targetRenderer != null)
        {
            // URPシェーダー用の色プロパティ名（_BaseColor）に変更
            targetRenderer.material.SetColor("_BaseColor", newColor);
        }
    }
}