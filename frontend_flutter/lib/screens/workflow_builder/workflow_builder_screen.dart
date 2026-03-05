import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';

import '../../models/workflow.dart';
import 'widgets/node_palette.dart';

class WorkflowBuilderScreen extends StatefulWidget {
  const WorkflowBuilderScreen({super.key});

  @override
  State<WorkflowBuilderScreen> createState() => _WorkflowBuilderScreenState();
}

class _WorkflowBuilderScreenState extends State<WorkflowBuilderScreen> {
  final List<WorkflowNode> _nodes = [];
  final uuid = const Uuid();

  void _addNode(String type) {
    setState(() {
      _nodes.add(WorkflowNode(
        id: uuid.v4(),
        type: type,
        name: type,
        parameters: {},
      ));
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Workflow Builder')),
      body: Column(
        children: [
          NodePalette(onAddNode: _addNode),
          Expanded(
            child: ListView.builder(
              itemCount: _nodes.length,
              itemBuilder: (context, index) {
                final node = _nodes[index];
                return ListTile(
                  title: Text(node.name),
                  subtitle: Text('Type: ${node.type}'),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          final definition = WorkflowDefinition(
            startNodeId: _nodes.isEmpty ? '' : _nodes.first.id,
            nodes: _nodes,
            connections: [],
          );
          showDialog<void>(
            context: context,
            builder: (_) => AlertDialog(
              title: const Text('Workflow JSON'),
              content: SingleChildScrollView(child: Text(definition.toJson().toString())),
            ),
          );
        },
        label: const Text('Preview JSON'),
      ),
    );
  }
}
