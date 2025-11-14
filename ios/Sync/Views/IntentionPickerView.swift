//
//  IntentionPickerView.swift
//  Sync
//
//  Intention selection view
//

import SwiftUI

struct IntentionPickerView: View {
    let onSelect: (SessionIntention) -> Void
    @State private var selectedCategory: IntentionCategory?
    @State private var note: String = ""
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Choose Your Intention")) {
                    ForEach(IntentionCategory.categories, id: \.id) { category in
                        Button {
                            selectedCategory = category
                        } label: {
                            HStack {
                                Text(category.emoji)
                                    .font(.title2)
                                Text(category.name)
                                    .foregroundColor(.primary)
                                Spacer()
                                if selectedCategory?.id == category.id {
                                    Image(systemName: "checkmark")
                                        .foregroundColor(.blue)
                                }
                            }
                        }
                    }
                }
                
                Section(header: Text("Personal Note (Optional)")) {
                    TextField("Add a personal note...", text: $note, axis: .vertical)
                        .lineLimit(3...6)
                }
                
                Section {
                    Button {
                        if let category = selectedCategory {
                            let intention = SessionIntention(
                                category: category.id,
                                note: note.isEmpty ? nil : note
                            )
                            onSelect(intention)
                        }
                    } label: {
                        Text("Join Session")
                            .frame(maxWidth: .infinity)
                    }
                    .disabled(selectedCategory == nil)
                }
            }
            .navigationTitle("Set Your Intention")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
    }
}

