package com.testui.selenium.utils;

// AI-ASSISTED: Cursor
// PROMPT: Create TestUi Selenium Java Maven POM with TestNG framework
// ACCEPTED-BY: vignesh

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.testui.selenium.constants.FrameworkConstants;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * JSON / CSV test-data readers for DataProviders.
 */
public final class DataReader {

    private static final Logger LOG = LogManager.getLogger(DataReader.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private DataReader() {
    }

    public static List<Map<String, String>> readCsv(String relativePath) {
        Path path = Path.of(FrameworkConstants.TESTDATA_DIR, relativePath);
        LOG.info("Reading CSV {}", path);
        try {
            List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
            if (lines.isEmpty()) {
                return List.of();
            }
            String[] headers = lines.get(0).split(",", -1);
            List<Map<String, String>> rows = new ArrayList<>();
            for (int i = 1; i < lines.size(); i++) {
                String line = lines.get(i).trim();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                String[] cols = line.split(",", -1);
                Map<String, String> row = new LinkedHashMap<>();
                for (int c = 0; c < headers.length; c++) {
                    row.put(headers[c].trim(), c < cols.length ? cols[c].trim() : "");
                }
                rows.add(row);
            }
            return rows;
        } catch (IOException e) {
            throw new IllegalStateException("Unable to read CSV: " + path, e);
        }
    }

    public static List<Map<String, Object>> readJsonArray(String classpathResource) {
        LOG.info("Reading JSON resource {}", classpathResource);
        try (InputStream in = DataReader.class.getClassLoader().getResourceAsStream(classpathResource)) {
            if (in == null) {
                throw new IllegalStateException("Missing resource: " + classpathResource);
            }
            return MAPPER.readValue(in, new TypeReference<>() {
            });
        } catch (IOException e) {
            throw new IllegalStateException("Unable to read JSON: " + classpathResource, e);
        }
    }

    public static String readClasspathText(String classpathResource) {
        try (InputStream in = DataReader.class.getClassLoader().getResourceAsStream(classpathResource)) {
            if (in == null) {
                throw new IllegalStateException("Missing resource: " + classpathResource);
            }
            return new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))
                    .lines()
                    .collect(Collectors.joining("\n"));
        } catch (IOException e) {
            throw new IllegalStateException("Unable to read resource: " + classpathResource, e);
        }
    }
}
