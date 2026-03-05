class Workflow {
  Workflow({
    required this.id,
    required this.name,
    required this.definition,
  });

  final String id;
  final String name;
  final Map<String, dynamic> definition;

  factory Workflow.fromJson(Map<String, dynamic> json) {
    return Workflow(
      id: json['id'] as String,
      name: json['name'] as String,
      definition: json['definition'] as Map<String, dynamic>,
    );
  }
}
