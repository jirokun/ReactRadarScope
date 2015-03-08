package net.jirox.radarscope.models;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Category {
	private Integer id;
	private String displayName;
	private List<Category> childCategories;
}
