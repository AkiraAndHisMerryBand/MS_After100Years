using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

// --- JSONのデータ構造に合わせたクラス定義 ---
[System.Serializable]
public class CreatureData
{
    public string id;
    public string name;
    public string environment;
    public string imageUrl;
    public string description;
    public CreatureParameters parameters;
}

[System.Serializable]
public class CreatureParameters
{
    public float temperature;
    public float space;
    public float brightness;
    public float food;
    public float predators;
}

// 設定ファイル（config.json）用のクラス
[System.Serializable]
public class ConfigData
{
    public string apiUrl;
}

public class UnityApiPoller : MonoBehaviour
{
    [Header("デフォルトのバックエンドURL（config.jsonがない場合のフォールバック）")]
    public string apiUrl = "http://localhost:3000/api/unity/events";

    // 既に生成した生物のIDを重複なく管理するセット
    private HashSet<string> spawnedCreatureIds = new HashSet<string>();

    void Start()
    {
        // 1. config.json からURLを読み込む処理
        LoadConfig();

        // 2. 5秒ごとのポーリング処理を開始
        StartCoroutine(PollBackendRoutine());
    }

    // config.json から URL を読み込む
    void LoadConfig()
    {
        TextAsset jsonFile = Resources.Load<TextAsset>("config");
        if (jsonFile != null)
        {
            try
            {
                ConfigData config = JsonUtility.FromJson<ConfigData>(jsonFile.text);
                if (!string.IsNullOrEmpty(config.apiUrl))
                {
                    apiUrl = config.apiUrl;
                    Debug.Log("config.json からURLを読み込みました: " + apiUrl);
                }
            }
            catch (System.Exception e)
            {
                Debug.LogWarning("config.json のパースに失敗しました: " + e.Message);
            }
        }
        else
        {
            Debug.Log("Resources/config.json が見つからないため、デフォルトのURLを使用します。");
        }
    }

    IEnumerator PollBackendRoutine()
    {
        while (true)
        {
            // バックエンドデータ取得のコルーチンを直接呼び出して待機する
            yield return StartCoroutine(GetRequest(apiUrl));

            // 5秒ごとに繰り返し
            yield return new WaitForSeconds(5f);
        }
    }

    // コルーチンを安全に呼び出すための補助メソッド
    private IEnumerator importCoroutineSafe(IEnumerator routine)
    {
        yield return StartCoroutine(routine);
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

                // 受信したJSONデータをパースしてオブジェクトを生成する処理
                ProcessReceivedData(jsonText);
            }
        }
    }

    // JSONデータの変換と重複チェック・オブジェクト生成
    void ProcessReceivedData(string jsonText)
    {
        try
        {
            // 単体オブジェクトとしてパース（リスト形式の場合は JsonHelper 等で配列化してください）
            CreatureData creature = JsonUtility.FromJson<CreatureData>(jsonText);

            if (creature != null && !string.IsNullOrEmpty(creature.id))
            {
                // すでに生成済みのIDかチェック
                if (spawnedCreatureIds.Contains(creature.id))
                {
                    Debug.Log($"生物ID: {creature.id} ({creature.name}) は既に生成済みのためスキップします。");
                    return;
                }

                // 新規IDなので記録する
                spawnedCreatureIds.Add(creature.id);

                // コンソールに詳細を表示
                Debug.Log($"[新種発見] 名前: {creature.name} / 環境: {creature.environment} / 説明: {creature.description}");

                // 球体オブジェクトを生成
                SpawnCreatureSphere(creature);
            }
        }
        catch (System.Exception e)
        {
            Debug.LogError("JSONの変換に失敗しました: " + e.Message);
        }
    }

    // 球体オブジェクトを生成してパラメータを反映するメソッド
    void SpawnCreatureSphere(CreatureData creature)
    {
        // プリミティブな球体を生成
        GameObject sphere = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        
        // 画面が重ならないようにランダムな位置に配置（または好みの座標に調整してください）
        sphere.transform.position = new Vector3(Random.Range(-5f, 5f), 1f, Random.Range(-5f, 5f));
        
        // 生成したオブジェクトの名前を生体名に変更
        sphere.name = $"Creature_{creature.name}_{creature.id}";

        // 必要に応じてマテリアルや色を変更する処理をここに記述できます
        // 例: 生物の環境に合わせて色を変えるなど
        Renderer renderer = sphere.GetComponent<Renderer>();
        if (renderer != null)
        {
            if (creature.environment == "ocean") renderer.material.color = Color.blue;
            else if (creature.environment == "cave") renderer.material.color = Color.gray;
            else if (creature.environment == "land") renderer.material.color = Color.yellow;
        }

        Debug.Log($"球体オブジェクトを生成しました: {sphere.name}");
    }
}