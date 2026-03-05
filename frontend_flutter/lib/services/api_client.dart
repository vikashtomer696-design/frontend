import 'package:dio/dio.dart';

class ApiClient {
  ApiClient(String baseUrl)
      : _dio = Dio(BaseOptions(baseUrl: baseUrl, connectTimeout: const Duration(seconds: 20)));

  final Dio _dio;

  Future<Response<dynamic>> post(String path, {dynamic data}) => _dio.post(path, data: data);
  Future<Response<dynamic>> put(String path, {dynamic data}) => _dio.put(path, data: data);
  Future<Response<dynamic>> get(String path) => _dio.get(path);
}
