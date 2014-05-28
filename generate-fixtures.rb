#!/usr/bin/env ruby

fixturespath = 'test/fixtures/'

# Get all fixture files
files = Dir.entries(fixturespath).select {|f| !File.directory? fixturespath + f}

# Generate "expected" files
files.each do |filename|
  srcpath = "#{fixturespath}#{filename}"
  destpath = "#{fixturespath}expected/#{filename}"
  puts "#{srcpath} -> #{destpath}"
  File.open(destpath, 'w+') do |dest|
    File.open(srcpath, 'r+') do |src|
      # For each line of source file, write an output line to dest file.
      src.each_with_index do |line, idx|
        dest.puts "[#{idx}] <#{line.chomp}>"
      end
    end
  end
end
