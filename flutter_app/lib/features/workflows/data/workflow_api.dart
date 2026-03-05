import 'package:dio/dio.dart';
import '../domain/workflow.dart';

class WorkflowApi {
  WorkflowApi({Dio? dio}) : _dio = dio ?? Dio(BaseOptions(baseUrl: 'http://localhost:4000/api/v1'));

  final Dio _dio;

  Future<List<Workflow>> fetchWorkflows() async {
    final response = await _dio.get('/executions'); // placeholder endpoint for demo
    final data = response.data as List<dynamic>;
    return data
        .map((item) => Workflow(
              id: item['id']?.toString() ?? 'unknown',
              name: item['workflowId']?.toString() ?? 'Execution Workflow',
              definition: const {},
            ))
        .toList();
  }
}
