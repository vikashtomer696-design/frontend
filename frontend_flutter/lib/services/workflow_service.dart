import '../models/workflow.dart';
import 'api_client.dart';

class WorkflowApiService {
  WorkflowApiService(this._apiClient);

  final ApiClient _apiClient;

  Future<void> createWorkflow({
    required String userId,
    required String name,
    required WorkflowDefinition definition,
  }) async {
    await _apiClient.post('/api/v1/workflows',
        data: {'userId': userId, 'name': name, 'definition': definition.toJson()});
  }

  Future<void> executeWorkflow(String workflowId, Map<String, dynamic> input) async {
    await _apiClient.post('/api/v1/workflows/$workflowId/execute', data: {'input': input});
  }
}
