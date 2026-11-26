using UnityEngine;
using UnityEditor;
using System.Collections.Generic;

public class CaveGenerator : EditorWindow
{
    int tunnelLength = 60;         // 洞窟の長さ
    float baseRadius = 6f;         // 基本の半径
    int radialSegments = 16;       // 円周方向のポリゴン数（少し増やして滑らかさとゴツゴツ感を両立）
    
    // ノイズパラメータ（洞窟の形状変化）
    float shapeNoiseScale = 0.08f; // 洞窟全体の曲がり具合
    float detailNoiseScale = 0.3f; // 岩肌の細かい凹凸
    float noiseStrength = 2.0f;    // 凹凸の激しさ

    [MenuItem("Tools/Cave Generator/Open Generator Window")]
    public static void ShowWindow()
    {
        GetWindow<CaveGenerator>("Cave Generator");
    }

    private void OnGUI()
    {
        GUILayout.Label("Advanced Natural Cave Generator", EditorStyles.boldLabel);
        GUILayout.Space(10);

        tunnelLength = EditorGUILayout.IntField("Tunnel Length", tunnelLength);
        baseRadius = EditorGUILayout.FloatField("Base Radius", baseRadius);
        radialSegments = EditorGUILayout.IntField("Radial Segments", radialSegments);
        
        GUILayout.Space(5);
        shapeNoiseScale = EditorGUILayout.FloatField("Path Curvature (Bend)", shapeNoiseScale);
        detailNoiseScale = EditorGUILayout.FloatField("Wall Detail Noise", detailNoiseScale);
        noiseStrength = EditorGUILayout.FloatField("Rock Roughness", noiseStrength);

        GUILayout.Space(15);

        if (GUILayout.Button("Generate Natural Cave Mesh", GUILayout.Height(35)))
        {
            GenerateNaturalCave();
        }
    }

    private void GenerateNaturalCave()
    {
        GameObject caveObj = new GameObject("NaturalCave_Procedural");
        MeshFilter meshFilter = caveObj.AddComponent<MeshFilter>();
        MeshRenderer meshRenderer = caveObj.AddComponent<MeshRenderer>();
        
        // URP Litマテリアルを設定
        meshRenderer.material = new Material(Shader.Find("Universal Render Pipeline/Lit"));
        meshRenderer.material.color = new Color(0.22f, 0.22f, 0.28f); // 洞窟らしい重厚感のある色
        meshRenderer.material.SetFloat("_Smoothness", 0.15f); // マットな岩肌

        Mesh mesh = new Mesh();
        mesh.name = "NaturalCaveMesh";

        List<Vector3> vertices = new List<Vector3>();
        List<int> triangles = new List<int>();
        List<Vector2> uvs = new List<Vector2>();

        int vertPerRow = radialSegments + 1;

        for (int z = 0; z <= tunnelLength; z++)
        {
            float zPos = z * 2.0f;

            // 1. 洞窟全体がダイナミックに蛇行するように、複数のSIN波とパーリンノイズを合成
            float pathOffsetX = Mathf.Sin(z * shapeNoiseScale * 5f) * 4f + Mathf.PerlinNoise(z * shapeNoiseScale, 0f) * 6f;
            float pathOffsetY = Mathf.Cos(z * shapeNoiseScale * 3f) * 2.5f + Mathf.PerlinNoise(0f, z * shapeNoiseScale) * 3f;

            for (int i = 0; i <= radialSegments; i++)
            {
                float t = i / (float)radialSegments;
                float angle = t * Mathf.PI * 2f;

                // 2. 天井を高めにする、床を平らにするなど、ただの丸い筒から脱却する補正
                float ovalFactorY = 1.0f;
                if (Mathf.Sin(angle) < 0) 
                {
                    // 床面を少し広げる・安定させる
                    ovalFactorY = 0.8f; 
                }

                // 3. 3次元的なノイズを組み合わせて、方向ごとに異なる岩肌のゴツゴツ感を生成
                float noiseDetail = Mathf.PerlinNoise(z * detailNoiseScale, i * detailNoiseScale) * noiseStrength;
                float currentRadius = baseRadius + noiseDetail;

                float x = Mathf.Cos(angle) * currentRadius * 1.2f + pathOffsetX;
                float y = Mathf.Sin(angle) * currentRadius * ovalFactorY + pathOffsetY;

                vertices.Add(new Vector3(x, y, zPos));
                uvs.Add(new Vector2(t * 4f, (float)z / 4f));
            }
        }

        // 三角形インデックスの構築
        for (int z = 0; z < tunnelLength; z++)
        {
            for (int i = 0; i < radialSegments; i++)
            {
                int current = z * vertPerRow + i;
                int next = current + vertPerRow;

                triangles.Add(current);
                triangles.Add(current + 1);
                triangles.Add(next);

                triangles.Add(current + 1);
                triangles.Add(next + 1);
                triangles.Add(next);
            }
        }

        mesh.SetVertices(vertices);
        mesh.SetTriangles(triangles, 0);
        mesh.SetUVs(0, uvs);
        mesh.RecalculateNormals();

        meshFilter.sharedMesh = mesh;
        caveObj.AddComponent<MeshCollider>();

        Debug.Log("Natural cave generated successfully!");
    }
}