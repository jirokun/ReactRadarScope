package net.jirox.radarscope;

import static org.junit.Assert.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import javax.script.ScriptException;

import net.jirox.radarscope.models.Category;
import net.jirox.radarscope.models.Genre;
import net.jirox.radarscope.models.Product;

import org.hamcrest.CoreMatchers;
import org.hamcrest.MatcherAssert;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.*;

public class RadarScopeTest {
	private Genre genreScsk = new Genre(1, "SCSK");
	private Category categoryWeb = new Category(1, "Web");
	private Product product = new Product(1, 4.2, "Moodle", categoryWeb,
			genreScsk);

	private String render() throws ScriptException, IOException {
		List<Product> productList = new ArrayList<>();
		productList.add(product);
		List<Product> rankingList = new ArrayList<>();
		rankingList.add(product);
		List<Category> categoryList = new ArrayList<>();
		categoryList.add(categoryWeb);
		String yearMonth = "201502";
		String path = "/radarScope/201502";

		String html = RadarScope.getInstance().render(path, yearMonth,
				productList, categoryList, rankingList);
		return html;
	}

	@Test
	public void プロダクトが出力される() throws ScriptException, IOException,
			InterruptedException {
		String html = render();
		assertThat(html, containsString("Moodle"));
	}

	@Test
	public void SVGが出力される() throws ScriptException, IOException,
			InterruptedException {
		String html = render();
		assertThat(html, containsString("<svg"));
	}

	@Test
	public void Dotが出力される() throws ScriptException, IOException,
			InterruptedException {
		String html = render();
		assertThat(html, containsString("$dot-1-text"));
	}

	@Test
	public void 複数同時実行してもエラーとならない() throws ScriptException, IOException,
			InterruptedException {
		List<Product> productList = new ArrayList<>();
		productList.add(product);
		List<Product> rankingList = new ArrayList<>();
		rankingList.add(product);
		List<Category> categoryList = new ArrayList<>();
		categoryList.add(categoryWeb);
		String yearMonth = "201502";
		String path = "/radarScope/201502";

		ExecutorService es = Executors.newFixedThreadPool(10);
		List<Callable<Boolean>> callableList = new ArrayList<>();
		for (int i = 0; i < 10; i++) {
			callableList.add(new Callable<Boolean>() {
				@Override
				public Boolean call() throws Exception {
					try {
						RadarScope.getInstance().render(path, yearMonth,
								productList, categoryList, rankingList);
						return true;
					} catch (Exception e) {
						return false;
					}
				}
			});
		}
		List<Future<Boolean>> results = es.invokeAll(callableList);
		results.stream().forEach(future -> {
			try {
				assertTrue(future.get());
			} catch (Exception e) {
				fail();
			}
		});
	}
}
