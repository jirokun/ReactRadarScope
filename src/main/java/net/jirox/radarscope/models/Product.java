package net.jirox.radarscope.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Product {
	private Integer id;
	private Double score;
	private String name;
	private Category category;
	private Category childCategory;
}
