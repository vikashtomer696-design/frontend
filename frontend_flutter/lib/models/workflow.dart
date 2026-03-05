class WorkflowDefinition {
  WorkflowDefinition({
    required this.startNodeId,
    required this.nodes,
    required this.connections,
  });

  final String startNodeId;
  final List<WorkflowNode> nodes;
  final List<NodeConnection> connections;

  Map<String, dynamic> toJson() => {
        'startNodeId': startNodeId,
        'nodes': nodes.map((n) => n.toJson()).toList(),
        'connections': connections.map((c) => c.toJson()).toList(),
      };
}

class WorkflowNode {
  WorkflowNode({
    required this.id,
    required this.type,
    required this.name,
    required this.parameters,
  });

  final String id;
  final String type;
  final String name;
  final Map<String, dynamic> parameters;

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type,
        'name': name,
        'parameters': parameters,
      };
}

class NodeConnection {
  NodeConnection({required this.source, required this.target});

  final String source;
  final String target;

  Map<String, dynamic> toJson() => {'source': source, 'target': target};
}
