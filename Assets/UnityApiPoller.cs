using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

[Serializable]
public class CreatureEvent
{
    public int event_id;
    public string creature_id;
    public string environment;
    public string asset_type;
    public string asset_url;
}

[Serializable]
public class EventResponse
{
    public List<CreatureEvent> events;
    public bool has_more;
}

// config.jsonの中身を受け取るための設計図
[Serializable]
public class ConfigData
{
    public string apiUrl;
}

public class UnityApiPoller : MonoBehaviour
{
    private string apiUrl;
    private HashSet<int> createdEventIds = new HashSet<int>();

    void Start()
    {
        // 1. 起動時に設定ファイル（config.json）からURLを読み込む
        LoadConfig();

        // 2. 5秒ごとの繰り返しをスタート
        StartCoroutine(PollBackendRoutine());
    }

    void LoadConfig()
    {
        // Resourcesフォルダ、またはプロジェクト内から config.json を探す
        TextAsset jsonFile = Resources.Load<TextAsset>("config");
        
        if (jsonFile != null)
        {
            try
            {
                ConfigData config = JsonUtility.FromJson<ConfigData>(jsonFile.text);
                apiUrl = config.apiUrl;
                Debug.Log("設定ファイルからURLを読み込みました: " + apiUrl);
            }
            catch (Exception e)
            {
                Debug.LogError("config.jsonの読み込みに失敗しました: " + e.Message);
                apiUrl = "http://localhost:3000/api/unity/events"; // 失敗したときの予備URL
            }
        }
        else
        {
            // ファイルが見つからない場合の予備（ハードコード回避）
            apiUrl = "http://localhost:3000/api/unity/events";
            Debug.LogWarning("config.jsonが見つからないため、デフォルトのURLを使用します。");
        }
    }

    IEnumerator PollBackendRoutine()
    {
        while (true)
        {
            if (!string.IsNullOrEmpty(apiUrl))
            {
                yield return StartCoroutine(GetRequest(apiUrl));
            }
            yield return new WaitForSeconds(5f); // 5秒待つ
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
                string jsonText = webRequest.downloadHandler.text;
                Debug.Log("【バックエンドからのデータ】: " + jsonText);
                ParseAndSpawnObjects(jsonText);
            }
        }
    }

    void ParseAndSpawnObjects(string jsonString)
    {
        try
        {
            EventResponse response = JsonUtility.FromJson<EventResponse>(jsonString);

            if (response != null && response.events != null)
            {
                foreach (var ev in response.events)
                {
                    if (!createdEventIds.Contains(ev.event_id))
                    {
                        createdEventIds.Add(ev.event_id);
                        SpawnSphereObject(ev);
                    }
                }
            }
        }
        catch (Exception e)
        {
            Debug.LogWarning("JSONの変換に失敗しました: " + e.Message);
        }
    }

    void SpawnSphereObject(CreatureEvent ev)
    {
        GameObject sphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        float randomX = UnityEngine.Random.Range(-4f, 4f);
        float randomZ = UnityEngine.Random.Range(1f, 5f);
        sphere.transform.position = new Vector3(randomX, 0.5f, randomZ);
        sphere.name = "Creature_" + ev.creature_id + "_ID_" + ev.event_id;
        Debug.Log("新しい「球体」の生物オブジェクトを生成しました！: " + sphere.name);
    }
}