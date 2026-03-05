import 'package:flutter/material.dart';

class WorkflowListPage extends StatelessWidget {
  const WorkflowListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Automation Workflows')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          _WorkflowCard(name: 'Inbound Webhook -> OpenAI -> Telegram'),
          _WorkflowCard(name: 'Scheduled HTTP Sync + If Condition'),
          _WorkflowCard(name: 'Delay + API Callback Pipeline'),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        icon: const Icon(Icons.add),
        label: const Text('New Workflow'),
      ),
    );
  }
}

class _WorkflowCard extends StatelessWidget {
  const _WorkflowCard({required this.name});

  final String name;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(name),
        subtitle: const Text('Tap to edit nodes and connections'),
        trailing: const Icon(Icons.chevron_right),
      ),
    );
  }
}
