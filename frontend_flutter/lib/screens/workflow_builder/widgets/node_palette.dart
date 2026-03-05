import 'package:flutter/material.dart';

class NodePalette extends StatelessWidget {
  const NodePalette({super.key, required this.onAddNode});

  final void Function(String type) onAddNode;

  static const nodeTypes = [
    'webhookTrigger',
    'httpRequest',
    'telegramSendMessage',
    'openAi',
    'delay',
    'ifCondition'
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 110,
      child: ListView.separated(
        padding: const EdgeInsets.all(12),
        scrollDirection: Axis.horizontal,
        itemBuilder: (context, index) {
          final node = nodeTypes[index];
          return ActionChip(label: Text(node), onPressed: () => onAddNode(node));
        },
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemCount: nodeTypes.length,
      ),
    );
  }
}
