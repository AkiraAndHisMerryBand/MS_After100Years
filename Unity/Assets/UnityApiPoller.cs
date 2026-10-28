using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

public class UnityApiPoller : MonoBehaviour
{
    
    [Header("バックエンドのURL")]
    public string apiUrl = "http://localhost:3000/api/unity/events"; // 例としてイベント取得APIを指定

    void Start()
    {
        
        StartCoroutine(PollBackendRoutine());
    }

    IEnumerator PollBackendRoutine()
    {
        
        while (true)
        {
            // バックエンドデータ
            StartCoroutine(GetRequest(apiUrl));

            // アクセス
            yield return new WaitForSeconds(5f);
        }
    }

    IEnumerator GetRequest(string uri)
    {
        using (UnityWebRequest webRequest = UnityWebRequest.Get(uri))
        {
            yield return webRequest.SendWebRequest();

            if (webRequest.result == UnityWebRequest.Result.ConnectionError || 
                webRequest.result == UnityWebRequest.Result.ProtocolError)
            {
                Debug.LogError("通信エラー: " + webRequest.error);
            }
            else
            {
                
                Debug.Log("【バックエンドからのデータ】: " + webRequest.downloadHandler.text);
            }
        }
    }
}