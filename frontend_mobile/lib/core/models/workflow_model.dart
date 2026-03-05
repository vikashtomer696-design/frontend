class WorkflowModel {
  final String id;
  final String name;
  final bool isActive;

  WorkflowModel({required this.id, required this.name, required this.isActive});

  factory WorkflowModel.fromJson(Map<String, dynamic> json) {
    return WorkflowModel(
      id: json['id'] as String,
      name: json['name'] as String,
      isActive: json['isActive'] as bool? ?? true
    );
  }
}
