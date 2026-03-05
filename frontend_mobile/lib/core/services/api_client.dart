import 'package:dio/dio.dart';

class ApiClient {
  final Dio _dio = Dio(BaseOptions(baseUrl: 'http://localhost:4000/api/v1'));

  Future<Response<dynamic>> get(String path) => _dio.get(path);
  Future<Response<dynamic>> post(String path, {dynamic data}) => _dio.post(path, data: data);
}
