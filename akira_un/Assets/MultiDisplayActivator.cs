using UnityEngine;

public class MultiDisplayActivator : MonoBehaviour
{
    void Start()
    {
        // 接続されているディスプレイの数だけループして有効化する
        for (int i = 1; i < Display.displays.Length; i++)
        {
            Display.displays[i].Activate();
        }
    }
}